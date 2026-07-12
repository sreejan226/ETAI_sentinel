from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

ROOT_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://sentinel:sentinel@localhost:5432/sentinelai"
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/0"
    celery_result_backend: str = "redis://localhost:6379/1"
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "sentinelai"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.3"
    gemini_api_key: str = ""
    cors_origins: str = "http://localhost:3000"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    use_celery: bool = False  # set True when Redis + worker are running

    model_config = SettingsConfigDict(
        env_file=str(ROOT_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
