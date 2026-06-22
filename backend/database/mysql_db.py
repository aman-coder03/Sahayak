from sqlalchemy import create_engine

from config import (
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE
)

DATABASE_URL = (
    f"mysql+pymysql://"
    f"{MYSQL_USER}:{MYSQL_PASSWORD}"
    f"@{MYSQL_HOST}:{MYSQL_PORT}"
    f"/{MYSQL_DATABASE}"
)

engine = create_engine(
    DATABASE_URL,
    echo=True
)