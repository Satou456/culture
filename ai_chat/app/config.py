from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "AI Cultural Chat"
    bigmodel_api_key: str = Field(default="")
    bigmodel_base_url: str = Field(default="https://open.bigmodel.cn/api/paas/v4")
    vision_model: str = Field(default="glm-4.1v-thinking-flash")
    chat_model: str = Field(default="glm-4.1v-thinking-flash")
    llm_timeout_seconds: float = Field(default=60.0)

    heimori_api_url: str = Field(default="")
    heimori_api_key: str = Field(default="")
    heimori_api_key_header: str = Field(default="Authorization")
    heimori_auth_prefix: str = Field(default="Bearer")
    heimori_timeout_seconds: float = Field(default=30.0)
    heimori_translation_model: str = Field(default="tengri-t1-pro")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
