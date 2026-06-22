from sqlalchemy.orm import sessionmaker

from database.mysql_db import engine

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)