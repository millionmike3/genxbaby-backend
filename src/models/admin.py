from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from backend.database import Base

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    role = Column(String)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
