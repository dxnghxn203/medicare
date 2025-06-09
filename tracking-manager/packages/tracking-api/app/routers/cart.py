from fastapi import APIRouter, status, Depends

from app.core import logger, response
from app.core.response import JsonException
from app.helpers.redis import get_session, save_session, get_cart, save_cart, remove_cart_item
from app.middleware import middleware
from app.models import user
from app.models.cart import get_cart_mongo, add_product_to_cart, remove_product_from_cart, \
    get_product_ids
from app.models.product import get_product_by_cart_id

router = APIRouter()

@router.get("/cart/session/", response_model=response.BaseResponse)
async def get_cart_session(session: str):
    try:
        check = get_session(session)
        cur_session = session if check else save_session()
        cart_data = get_cart(cur_session)
        logger.info(f"cart_data: {type (cart_data)}")

        cart = []
        for raw_key, raw_value in cart_data.items():
            key = raw_key.decode() if isinstance(raw_key, bytes) else raw_key
            value = raw_value.decode() if isinstance(raw_value, bytes) else raw_value

            try:
                quantity = int(value)
                product_id, price_id = key.split("_", 1)  # split only once
                cart.append({
                    "product_id": product_id,
                    "price_id": price_id,
                    "quantity": quantity
                })
            except Exception as parse_error:
                logger.error(f"Error parsing cart item key={key}, value={value}: {parse_error}")
                continue

        logger.info(f"cart: {cart}")
        product_ids = list(set([item["product_id"] for item in cart]))
        products = await get_product_by_cart_id(product_ids, cart)
        return response.BaseResponse(
            status="success",
            message="Cart retrieved successfully",
            data={
                "session_id": cur_session,
                "products": products
            })

    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting cart session", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/cart/session/", response_model=response.BaseResponse)
async def delete_cart_session(session: str, product_id: str, price_id: str):
    try:
        check = get_session(session)
        if not check:
            return response.BaseResponse(
                status="error",
                message="Session not found",
                data=None
            )
        remove_cart_item(session, f"{product_id}_{price_id}")
        return response.BaseResponse(
            status="success",
            message="Cart deleted successfully",
        )

    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error deleting cart session", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/cart/session/", response_model=response.BaseResponse)
async def add_to_cart(session: str, product_id: str, price_id: str,  quantity: int):
    try:
        check = get_session(session)
        cur_session = session if check else save_session()
        save_cart(cur_session, f"{product_id}_{price_id}", quantity)
        return response.BaseResponse(
            status="success",
            message="Product added to cart successfully",
            data={
                "session_id": cur_session
            }
        )

    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error adding product to cart", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/cart/", response_model=response.BaseResponse)
async def get_cart_token(token: str = Depends(middleware.verify_token)):
    try:
        us = await user.get_current(token)
        if not us:
            return response.BaseResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                status="error",
                message="User not found",
                data=None
            )
        cart = await get_cart_mongo(us.id)
        product_ids = await get_product_ids(us.id)
        n_cart = [
            {"product_id": item["product_id"], "price_id": item["price_id"], "quantity": item["quantity"]}
            for item in cart
        ]
        logger.info(f"n_cart: {n_cart}")
        products = await get_product_by_cart_id(product_ids, n_cart) if cart else []
        return response.BaseResponse(
            status="success",
            message="Cart retrieved successfully",
            data={
                "session_id": None,
                "products": products
            })

    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting cart session", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/cart/", response_model=response.BaseResponse)
async def add_to_cart_token(token: str = Depends(middleware.verify_token), product_id: str = None, price_id: str = None, quantity: int = 1):
    try:
        us = await user.get_current(token)
        if not us:
            return response.BaseResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                status="error",
                message="User not found",
                data=None
            )

        return await add_product_to_cart(us.id, product_id, price_id, quantity)

    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error adding product to cart", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/cart/", response_model=response.BaseResponse)
async def delete_cart_token(token: str = Depends(middleware.verify_token), product_id: str = None, price_id: str = None):
    try:
        us = await user.get_current(token)
        if not us:
            return response.BaseResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                status="error",
                message="User not found",
                data=None
            )
        return await remove_product_from_cart(us.id, product_id, price_id)

    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error removing product from cart", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )