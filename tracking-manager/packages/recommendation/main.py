import logging

import uvicorn
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from core import response, exception
from routers.recommendation import router as recommendation_router
from routers.chat import router as chat_router
from routers.document_router import router as medical_document_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "https://kltn-2025-tracking-api.onrender.com",
    "https://shop.medicaretech.io.vn"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(response.JsonException, exception.json_exception_handler)
app.add_exception_handler(RequestValidationError, exception.validation_exception_handler)

# Routers
app.include_router(recommendation_router, prefix="/v1", tags=["Recommendation"])
app.include_router(chat_router, prefix="/v1", tags=["Chatbot"])
app.include_router(medical_document_router, prefix="/v1", tags=["Medical Document"])
@app.get("/read-root")
def read_root():
    return {
        "service": "Recommender API",
        "version": "1.0.0",
        "status": "active"
    }
@app.get("/")
def home():
    return {
        "service": "Recommender API",
        "version": "1.0.0",
        "status": "active"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
