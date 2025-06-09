from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Payment Service"
    DEBUG: bool = True
    API_PREFIX: str = "/api/v1"
    
    class Config:
        case_sensitive = True

settings = Settings()
