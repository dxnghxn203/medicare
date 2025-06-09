import os
from langchain_openai import ChatOpenAI

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
OPENAI_MODEL_NAME = os.getenv("LLM_MODEL_NAME", "gpt-4o-mini")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables.")

try:
    llm = ChatOpenAI(
        openai_api_key=OPENAI_API_KEY,
        model_name=OPENAI_MODEL_NAME,
        base_url=OPENAI_BASE_URL,
    )
    print(f"Successfully initialized LLM with model: {OPENAI_MODEL_NAME} and base URL: {OPENAI_BASE_URL}")

except Exception as e:
    raise RuntimeError(f"Could not initialize LLM: {e}") from e
