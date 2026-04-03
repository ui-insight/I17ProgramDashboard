"""Application configuration via environment variables."""

import json

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "I-17 Program Dashboard"
    DATABASE_URL: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5432/i17dashboard"
    )
    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    DEV_MODE: bool = True
    UPLOAD_DIR: str = "./uploads"
    DATA_DIR: str = ""
    CORS_ORIGINS: str = '["http://localhost:5173", "http://localhost:9200"]'

    @property
    def cors_origins_list(self) -> list[str]:
        return json.loads(self.CORS_ORIGINS)

    def check_security(self) -> None:
        """Raise if default secrets are used in production."""
        if not self.DEV_MODE and self.SECRET_KEY == "change-me-in-production":
            raise RuntimeError(
                "SECRET_KEY must be changed from default in production. "
                "Set DEV_MODE=true for development or change SECRET_KEY."
            )

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
