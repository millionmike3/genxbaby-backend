from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# ============================================================
# DATABASE URL
# ============================================================

# Use SQLite locally unless you switch to PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# ============================================================
# SQLALCHEMY ENGINE
# ============================================================

# SQLite requires special connect args
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    echo=False,              # Set to True if you want SQL logs
    future=True,
    connect_args=connect_args
)

# ============================================================
# SESSION
# ============================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True
)

# ============================================================
# BASE MODEL
# ============================================================

Base = declarative_base()

# ============================================================
# UTILITY: GET DB SESSION
# ============================================================

def get_db():
    """
    FastAPI dependency that yields a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
