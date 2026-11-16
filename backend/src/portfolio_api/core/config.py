"""Configuration centralisée (variables d'environnement / .env)."""

from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=(".env", "../.env"), env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Portfolio Polyglotte API"
    debug: bool = False

    mongo_url: str
    mongo_db: str 

    neo4j_uri: str 
    neo4j_user: str 
    neo4j_password: str

    cors_origins: str 

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
