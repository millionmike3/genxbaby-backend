from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Local development uses SQLite
LOCAL_SQLITE_URL = "sqlite:///./genxbaby.db"

# Production (Railway) uses PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", LOCAL_SQLITE_URL)

# Engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
