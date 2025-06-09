import json
import os
import re
import core.logger as app_logger
from langchain.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder
)
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain.chains import LLMChain

from core.llm_config import llm
from core.redis import redis_client
from models.product import (
    search_products_by_text,
    get_product_by_id as get_product_by_mongo_id,
    check_out_of_stock  # Thêm import
)

SUGGESTED_PRODUCTS_KEY_PREFIX = "suggested_products:"
MAX_SUGGESTED_PRODUCTS_HISTORY = 3
SESSION_MEMORY_KEY_PREFIX = "chat_history:"

def _get_chat_history_from_redis(session_id: str) -> list:
    key = f"{SESSION_MEMORY_KEY_PREFIX}{session_id}"
    chat_messages = []
    try:
        raw_messages_str_list = redis_client.lrange(key, 0, -1)
        for raw_msg_str in raw_messages_str_list:
            try:
                msg_data = json.loads(raw_msg_str)
                msg_type = msg_data.get("type")
                msg_content = msg_data.get("content")
                if msg_type == "human" and msg_content is not None:
                    chat_messages.append(HumanMessage(content=msg_content))
                elif msg_type == "ai" and msg_content is not None:
                    chat_messages.append(AIMessage(content=msg_content))
                else:
                    app_logger.warn(f"Skipping malformed message from Redis for session {session_id}: {raw_msg_str}")
            except json.JSONDecodeError:
                app_logger.error(f"Failed to decode JSON for a message in session {session_id}: {raw_msg_str}")
            except Exception as e:
                app_logger.error(f"Error processing a message from Redis history for session {session_id}: {e}")
    except Exception as e:
        app_logger.error(f"Failed to retrieve chat history from Redis for session {session_id}: {e}")
    return chat_messages


def _add_message_to_redis_history(session_id: str, message_content: str, message_type: str):
    key = f"{SESSION_MEMORY_KEY_PREFIX}{session_id}"
    try:
        message_to_store = json.dumps({"type": message_type, "content": message_content})
        redis_client.rpush(key, message_to_store)
    except Exception as e:
        app_logger.error(f"Failed to add message to Redis history for session {session_id}: {e}")


def _get_suggested_products_context(session_id: str) -> str:
    if not redis_client:
        app_logger.warn("Redis client not available for _get_suggested_products_context.")
        return "Chưa có sản phẩm nào được gợi ý gần đây (Redis không khả dụng)."
    key = f"{SUGGESTED_PRODUCTS_KEY_PREFIX}{session_id}"
    try:
        product_suggestions_json_list = redis_client.lrange(key, 0, -1)
    except Exception as e:
        app_logger.error(f"Redis error lrange for key {key}: {e}")
        return "Lỗi khi truy xuất lịch sử gợi ý sản phẩm."
    if not product_suggestions_json_list:
        return "Chưa có sản phẩm nào được gợi ý gần đây."
    suggestions_text_parts = []
    for i, prod_json_str in enumerate(reversed(product_suggestions_json_list)):
        try:
            prod = json.loads(prod_json_str)
            suggestions_text_parts.append(
                f"{i + 1}. Tên: {prod.get('name', 'N/A')}")
        except json.JSONDecodeError:
            app_logger.warn(f"Failed to parse product JSON from Redis: {prod_json_str}")
            continue
        except Exception as e:
            app_logger.error(f"Error processing suggested product from Redis: {e}")
            continue
    if not suggestions_text_parts:
        return "Chưa có sản phẩm nào được gợi ý gần đây."
    return "Các sản phẩm bạn (AI) đã gợi ý hoặc đang thảo luận gần đây:\n" + "\n".join(suggestions_text_parts)


def _store_suggested_product(session_id: str, product_ref_id: str, product_name: str):
    if not redis_client:
        app_logger.warn("Cannot store suggested product, Redis client not available.")
        return
    if not product_ref_id or not product_name:
        app_logger.warn(
            f"Attempted to store suggested product with missing ID or name. ID: {product_ref_id}, Name: {product_name}")
        return
    key = f"{SUGGESTED_PRODUCTS_KEY_PREFIX}{session_id}"
    product_data = json.dumps({"id": product_ref_id, "name": product_name})
    try:
        redis_client.lpush(key, product_data)
        redis_client.ltrim(key, 0, MAX_SUGGESTED_PRODUCTS_HISTORY - 1)
        app_logger.info(
            f"Stored suggested product '{product_name}' (Ref ID: {product_ref_id}) for session {session_id}")
    except Exception as e:
        app_logger.error(f"Redis error lpush/ltrim for key {key}: {e}")


def _format_price_info(ref_id: str, prices_list: list) -> str:
    if not prices_list:
        return "Hiện chưa có thông tin giá cho sản phẩm này."
    price_details_parts = []
    for price_entry in prices_list:
        check = check_out_of_stock(ref_id, price_id=price_entry.get("price_id"))
        unit = price_entry.get("unit", "")
        amount_in_unit = price_entry.get("amount", 1)
        price_val = price_entry.get("price")
        original_price = price_entry.get("original_price")
        price_str = f"{price_val:,} VND".replace(",", ".") if price_val is not None else "N/A"
        entry_str = f"{amount_in_unit} {unit}: {price_str}"
        if original_price and original_price != price_val and price_val is not None:
            original_price_str = f"{original_price:,} VND".replace(",", ".")
            entry_str += f" (giá gốc: {original_price_str})"
        if check is not None:
            entry_str += f" - {'Hết hàng' if check else 'Còn hàng'}"
        price_details_parts.append(entry_str)
    return "\n".join(price_details_parts)


def strip_markdown_json(s: str) -> str:
    if s is None:
        return ""
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", s, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return s.strip()


def _interpret_user_request_with_llm(user_input: str, chat_history_messages: list,
                                     suggested_products_context: str) -> dict:
    system_prompt_content = (
        "Phân tích yêu cầu của người dùng dựa trên tin nhắn mới nhất, lịch sử trò chuyện và các sản phẩm đã được gợi ý. "
        "Mục tiêu là hiểu rõ ý định của người dùng để hệ thống có thể xử lý phù hợp. "
        "Trả về một đối tượng JSON với các trường sau: "
        "'intent' (string, một trong các giá trị: 'find_product_by_symptom', 'find_specific_product', 'ask_about_suggested_product', 'general_question', 'greeting', 'farewell', 'clarification_needed'). "
        "'target_product_ref_id' (string or null, ID tham chiếu của sản phẩm người dùng đang hỏi (thường là product_id từ MongoDB), nếu có, ưu tiên ID nếu xác định được từ ngữ cảnh gợi ý). "
        "'target_product_name' (string or null, tên sản phẩm người dùng có thể đã đề cập). "
        "'question_details' (string or null, chi tiết câu hỏi về sản phẩm, ví dụ: 'giá', 'cách dùng', 'thành phần', 'công dụng', 'inventory_status' (cho câu hỏi còn hàng không)). "
        "'symptoms' (list of strings or null, danh sách các triệu chứng người dùng mô tả, nếu intent là 'find_product_by_symptom'). "
        "'search_keywords' (string or null, chuỗi từ khóa để tìm sản phẩm nếu người dùng yêu cầu tìm sản phẩm cụ thể hoặc mô tả triệu chứng). "
        "Nếu người dùng hỏi về giá của một sản phẩm cụ thể, ví dụ 'Sản phẩm X giá bao nhiêu?', hãy đặt intent là 'find_specific_product', search_keywords là 'Sản phẩm X', và question_details là 'giá'. "
        "Nếu người dùng hỏi 'Sản phẩm X còn hàng không?', hãy đặt intent là 'find_specific_product', search_keywords là 'Sản phẩm X', và question_details là 'inventory_status'. "
        "Nếu người dùng hỏi thông tin chung về sản phẩm X, ví dụ 'Cho tôi biết về sản phẩm X', hãy đặt intent là 'find_specific_product' và search_keywords là 'Sản phẩm X', question_details có thể là 'thông tin chung' hoặc null. "
        "Nếu người dùng dùng đại từ như 'nó', 'cái đó', hãy cố gắng liên kết với sản phẩm trong 'suggested_products_context' và trả về 'target_product_ref_id' tương ứng. "
        "Nếu thông tin không đủ rõ ràng để xác định một ý định cụ thể hoặc sản phẩm, đặt intent là 'clarification_needed'.\n"
        f"Ngữ cảnh sản phẩm đã gợi ý (bởi AI): {suggested_products_context}"
    )
    messages_for_llm_interpretation = [SystemMessage(content=system_prompt_content)]
    messages_for_llm_interpretation.extend(chat_history_messages)
    messages_for_llm_interpretation.append(HumanMessage(content=f"Tin nhắn người dùng cần phân tích: {user_input}"))
    llm_interpretation_str = ""
    try:
        response_from_llm = llm.invoke(messages_for_llm_interpretation)
        if hasattr(response_from_llm, 'content'):
            llm_interpretation_str = response_from_llm.content
        else:
            llm_interpretation_str = str(response_from_llm)
            app_logger.warn(f"LLM interpretation response does not have 'content' attribute: {response_from_llm}")
    except Exception as e:
        app_logger.error(f"Error invoking LLM for interpretation: {e}", exc_info=True)
        return {
            "intent": "clarification_needed", "target_product_ref_id": None,
            "target_product_name": None, "question_details": "Lỗi khi gọi LLM phân tích.",
            "symptoms": None, "search_keywords": user_input
        }
    app_logger.debug(f"LLM interpretation output (raw): {llm_interpretation_str}")
    cleaned_json_str = strip_markdown_json(llm_interpretation_str)
    app_logger.debug(f"LLM interpretation output (cleaned): {cleaned_json_str}")
    try:
        parsed_interpretation = json.loads(cleaned_json_str)
        return parsed_interpretation
    except json.JSONDecodeError as e:
        app_logger.error(
            f"Failed to parse JSON from LLM interpretation (cleaned string was: '{cleaned_json_str}'). Error: {e}",
            exc_info=True)
        return {
            "intent": "clarification_needed",
            "target_product_ref_id": None,
            "target_product_name": None,
            "question_details": "Lỗi phân tích JSON từ LLM.",
            "symptoms": None,
            "search_keywords": user_input
        }


def generate_response(session_id: str, user_input: str) -> str:
    current_chat_history_messages = _get_chat_history_from_redis(session_id)
    suggested_products_context_for_interpretation = _get_suggested_products_context(session_id)
    user_request_info = _interpret_user_request_with_llm(
        user_input,
        current_chat_history_messages,
        suggested_products_context_for_interpretation
    )
    app_logger.info(f"Interpreted user request for session {session_id}: {user_request_info}")
    intent = user_request_info.get("intent", "general_question")
    search_keywords = user_request_info.get("search_keywords")
    symptoms_list = user_request_info.get("symptoms")
    target_product_ref_id = user_request_info.get("target_product_ref_id")
    raw_question_details = user_request_info.get("question_details")
    question_details = raw_question_details.lower() if isinstance(raw_question_details, str) else ""
    final_context_for_response_prompt = "Không có thông tin sản phẩm cụ thể nào được tìm thấy hoặc yêu cầu."
    product_found_for_storing = None
    if intent == "find_product_by_symptom" and (search_keywords or symptoms_list):
        query = " ".join(symptoms_list) if symptoms_list else search_keywords
        if not query: query = user_input
        app_logger.info(f"Searching products by symptoms/keywords for session {session_id}: '{query}'")
        products = search_products_by_text(query, limit=3)
        if products:
            formatted_products = []
            for p_item in products:
                ref_id = p_item.get('product_id')
                slug = p_item.get('slug', '')
                p_name = p_item.get('product_name', 'N/A')
                prices_list = p_item.get('prices', [])
                price_info_str = _format_price_info(ref_id, prices_list)
                image_url = p_item.get('images_primary', '')
                formatted_products.append(
                    f"- Tên: {p_name}\n  Công dụng: {p_item.get('uses', 'N/A')}\n  Giá: {price_info_str}\n  ")
                if slug:
                    formatted_products.append(f"  Slug: {slug}")
                if image_url:
                    formatted_products.append(f"  Hình ảnh: {image_url}")
                if ref_id and not product_found_for_storing:
                    product_found_for_storing = {"id": ref_id, "name": p_name}
            final_context_for_response_prompt = "Dựa trên mô tả của bạn, đây là một số sản phẩm phù hợp:\n" + "\n\n".join(
                formatted_products)
        else:
            final_context_for_response_prompt = f"Xin lỗi, tôi không tìm thấy sản phẩm nào phù hợp với: '{query}'."

    elif intent == "find_specific_product" and search_keywords:
        app_logger.info(f"Searching for specific product by keywords for session {session_id}: '{search_keywords}'")
        products_found = search_products_by_text(search_keywords, limit=1)
        if products_found:
            p_item = products_found[0]
            ref_id = p_item.get('product_id')
            slug = p_item.get('slug', '')
            p_name = p_item.get('product_name', 'N/A')
            image_url = p_item.get('images_primary', '')
            context_parts = [f"Thông tin về sản phẩm '{p_name}':"]
            if slug:
                context_parts.append(f"- Slug: {slug}")
            if image_url:
                context_parts.append(f"- Hình ảnh: {image_url}")
            basic_info_map = {
                "Công dụng": p_item.get("uses"),
                "Thành phần chính": ", ".join([ing.get('ingredient_name', '') for ing in
                                               p_item.get('ingredients', [])[:3]]) + "..." if p_item.get(
                    'ingredients') else "Chưa rõ",
                "Dạng bào chế": p_item.get("dosage_form"),
                "Thương hiệu": p_item.get("brand"),
                "Xuất xứ": p_item.get("origin"),
            }
            if question_details not in ["inventory_status", "giá"]:
                for label, value in basic_info_map.items():
                    if value:
                        context_parts.append(f"- {label}: {value}")

            prices_list = p_item.get('prices', [])
            price_info_str = _format_price_info(ref_id, prices_list)
            inventory_status_str = ""
            if ref_id:
                is_out_of_stock = check_out_of_stock(ref_id, price_info_str)
                inventory_status_str = "Hết hàng" if is_out_of_stock else "Còn hàng"

            if "inventory_status" in question_details:
                context_parts.append(
                    f"- Tình trạng: {inventory_status_str if inventory_status_str else 'Không xác định'}")
            elif "giá" in question_details:
                context_parts.append(f"- Giá: {price_info_str}")
                if inventory_status_str: context_parts.append(
                    f"- Tình trạng: {inventory_status_str}")
            elif question_details:
                detail_value = p_item.get(question_details)
                if detail_value is None:
                    if question_details == "cách dùng":
                        detail_value = p_item.get("dosage")
                    elif question_details == "thành phần":
                        ingredients_data = p_item.get('ingredients', [])
                        detail_value = ", ".join([ing.get('ingredient_name', '') + (
                            f" ({ing.get('ingredient_amount')})" if ing.get('ingredient_amount') else "") for ing in
                                                  ingredients_data]) if ingredients_data else "Chưa có thông tin."
                context_parts.append(
                    f"- {question_details.capitalize()}: {detail_value if detail_value is not None else 'Thông tin này chưa được cập nhật.'}")
                if "giá" not in question_details: context_parts.append(
                    f"- Giá: {price_info_str}")
                if "inventory_status" not in question_details and inventory_status_str: context_parts.append(
                    f"- Tình trạng: {inventory_status_str}")
            else:
                for label, value in basic_info_map.items():
                    if value and f"- {label}: {value}" not in context_parts:
                        context_parts.append(f"- {label}: {value}")
                context_parts.append(f"- Giá: {price_info_str}")
                if inventory_status_str: context_parts.append(f"- Tình trạng: {inventory_status_str}")

            if ref_id:
                context_parts.append(f"- (Mã tham chiếu: {ref_id})")
            final_context_for_response_prompt = "\n".join(context_parts)
            product_found_for_storing = {"id": ref_id, "name": p_name}
        else:
            final_context_for_response_prompt = f"Xin lỗi, tôi không tìm thấy sản phẩm có tên '{search_keywords}'."

    elif intent == "ask_about_suggested_product" and target_product_ref_id:
        app_logger.info(f"Getting details for product with Ref ID for session {session_id}: '{target_product_ref_id}'")
        product_details = get_product_by_mongo_id(target_product_ref_id)
        if product_details:
            p_name = product_details.get('product_name', target_product_ref_id)
            ref_id = product_details.get('product_id')
            slug = product_details.get('slug', '')
            details_str_parts = [f"Thông tin chi tiết về sản phẩm '{p_name}':"]
            image_url = product_details.get('images_primary', '')
            prices_list = product_details.get('prices', [])
            price_info_str = _format_price_info(ref_id, prices_list)
            inventory_status_str = ""
            if slug:
                details_str_parts.append(f"- Slug: {slug}")
            if image_url:
                details_str_parts.append(f"- Hình ảnh: {image_url}")

            if "inventory_status" in question_details:
                details_str_parts.append(
                    f"- Tình trạng: {inventory_status_str if inventory_status_str else 'Không xác định'}")
            elif "giá" in question_details:
                details_str_parts.append(f"- Giá: {price_info_str}")
                if inventory_status_str: details_str_parts.append(f"- Tình trạng: {inventory_status_str}")
            elif question_details:
                detail_value = None
                if "cách dùng" in question_details or "liều dùng" in question_details:
                    detail_value = product_details.get('dosage', 'Chưa có thông tin.')
                elif "thành phần" in question_details:
                    ingredients_data = product_details.get('ingredients', [])
                    detail_value = ", ".join([ing.get('ingredient_name', '') + (
                        f" ({ing.get('ingredient_amount')})" if ing.get('ingredient_amount') else "") for ing in
                                              ingredients_data]) if ingredients_data else "Chưa có thông tin."
                else:
                    detail_value = product_details.get(question_details, 'Thông tin này chưa được cập nhật.')
                details_str_parts.append(f"- {question_details.capitalize()}: {detail_value}")
                if "giá" not in question_details: details_str_parts.append(f"- Giá: {price_info_str}")
                if "inventory_status" not in question_details and inventory_status_str: details_str_parts.append(
                    f"- Tình trạng: {inventory_status_str}")
            else:
                details_str_parts.append(f"- Công dụng: {product_details.get('uses', 'Chưa có thông tin.')}")
                details_str_parts.append(f"- Giá: {price_info_str}")
                if inventory_status_str: details_str_parts.append(f"- Tình trạng: {inventory_status_str}")

            final_context_for_response_prompt = "\n".join(details_str_parts)
            product_found_for_storing = {"id": ref_id, "name": p_name}
        else:
            final_context_for_response_prompt = (
                f"Xin lỗi, tôi không có đủ thông tin chi tiết về sản phẩm"
                f"để trả lời câu hỏi '{question_details if question_details else ''}'. Có thể sản phẩm này không còn hoặc mã không đúng.")

    elif intent == "clarification_needed":
        error_detail_from_intent = user_request_info.get("question_details", "")
        if error_detail_from_intent and  "Lỗi" in error_detail_from_intent:
            final_context_for_response_prompt = f"Tôi gặp một chút trục trặc khi xử lý yêu cầu của bạn ({error_detail_from_intent}). Bạn có thể thử lại hoặc diễn đạt khác được không?"
        else:
            final_context_for_response_prompt = "Tôi chưa hiểu rõ ý của bạn. Bạn có thể diễn đạt lại hoặc cung cấp thêm thông tin được không?"
    if product_found_for_storing and product_found_for_storing.get("id") and product_found_for_storing.get("name"):
        _store_suggested_product(session_id, product_found_for_storing["id"], product_found_for_storing["name"])

    response_system_prompt_template_str = (
        "Bạn là một trợ lý AI của cửa hàng dược trực tuyến tại Việt Nam, tên là 'Medicare Chatbot Dược Sĩ'. "
        "Hãy luôn thân thiện, chuyên nghiệp và hữu ích. "
        "Nhiệm vụ của bạn là trả lời câu hỏi, tư vấn sản phẩm dựa trên thông tin được cung cấp và lịch sử trò chuyện. "
        "Nếu bạn vừa tìm thấy sản phẩm cho người dùng, hãy trình bày thông tin một cách rõ ràng và mời họ xem xét. "
        "Nếu người dùng hỏi về sản phẩm đã gợi ý, hãy cung cấp thông tin chi tiết. "
        "Nếu không chắc chắn hoặc không có thông tin, hãy nói rõ và đề nghị hỗ trợ thêm hoặc hỏi lại cho rõ. "
        "Sử dụng tiếng Việt. Trả lời ngắn gọn, đi thẳng vào vấn đề nếu có thể. "
        "Khi cung cấp giá hoặc tình trạng hàng, hãy liệt kê rõ ràng. Ví dụ: 'Sản phẩm X giá 100.000 VND/Hộp và hiện còn hàng.' hoặc 'Sản phẩm Y giá 200.000 VND/Vĩ và hiện đã hết hàng.'\n"
         "HƯỚNG DẪN HIỂN THỊ HÌNH ẢNH:\n"
        "Khi bạn nhận được URL hình ảnh sản phẩm (thường sau cụm 'Hình ảnh:'), hiển thị hình ảnh đó bằng thẻ HTML như sau:\n"
        "<img src=\"URL_HÌNH_ẢNH\" alt=\"Hình ảnh sản phẩm\" style=\"max-width: 250px; min-width: 150px; width: 100%; height: auto; border-radius: 8px; object-fit: contain; margin: 10px 0;\">\n\n"
        
        "HƯỚNG DẪN TẠO LIÊN KẾT SẢN PHẨM:\n"
        "Khi bạn thấy thông tin 'Slug' của sản phẩm, hãy tạo liên kết đến trang chi tiết sản phẩm BẮT BUỘC phải sử dụng CHÍNH XÁC mẫu sau:\n"
        "<a href=\"/chi-tiet-san-pham/SLUG\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: #FF5722; text-decoration: underline; font-weight: bold;\" >Xem chi tiết sản phẩm</a>\n\n"

        "Thông tin hỗ trợ cho câu trả lời của bạn (nếu có): {context_for_response_generation}\n"
        "Sản phẩm bạn (AI) đã gợi ý hoặc đang thảo luận gần đây (để bạn nhớ ngữ cảnh): {latest_suggested_products_context}"
        "Trả về dạng html với các thẻ <p>, <ul>, <li> <url>, <img>, ... cho câu trả lời. "
    )
    response_prompt_template = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(response_system_prompt_template_str),
        MessagesPlaceholder(variable_name="chat_history"),
        HumanMessagePromptTemplate.from_template("{user_input_for_response}")
    ])
    response_chain = LLMChain(
        llm=llm,
        prompt=response_prompt_template,
        verbose=False
    )
    latest_suggested_products_context_for_response = _get_suggested_products_context(session_id)
    input_data_for_response = {
        "user_input_for_response": user_input,
        "context_for_response_generation": final_context_for_response_prompt,
        "latest_suggested_products_context": latest_suggested_products_context_for_response,
        "chat_history": current_chat_history_messages
    }
    response_dict = response_chain.invoke(input_data_for_response)
    final_ai_response = response_dict.get(response_chain.output_key)
    if final_ai_response is None:
        final_ai_response = "Xin lỗi, tôi không thể tạo phản hồi lúc này."
        app_logger.warn(
            f"LLM response for generation was None or key '{response_chain.output_key}' not found. Response dict: {response_dict}")

    _add_message_to_redis_history(session_id, user_input, "human")
    _add_message_to_redis_history(session_id, final_ai_response, "ai")
    app_logger.info(f"Final AI response for session {session_id}: {final_ai_response}")
    return final_ai_response