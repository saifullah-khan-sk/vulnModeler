from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    """Application settings and configuration"""
    
    API_TITLE: str = "VulnModeler API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "Security vulnerability analysis and threat modeling platform"
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    CORS_CREDENTIALS: bool = True
    CORS_METHODS: List[str] = ["*"]
    CORS_HEADERS: List[str] = ["*"]
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["py", "js", "ts", "jsx", "tsx", "java", "cpp", "c", "go", "rs"]
    
    class Config:
        env_file = ".env"

settings = Settings()
