from pydantic import BaseSettings


class Settings(BaseSettings):
    IPINFO_TOKEN: str = ""
    LOG_LEVEL: str = "INFO"
    RATE_LIMIT_PER_MINUTE: int = 30

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
