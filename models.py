from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# -----------------------------------------------------------
# USER MODEL
# -----------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to Borrowers
    borrowers = relationship("Borrower", back_populates="user")


# -----------------------------------------------------------
# DOMAIN MODEL
# -----------------------------------------------------------
class Domain(Base):
    __tablename__ = "domains"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to Borrowers
    borrowers = relationship("Borrower", back_populates="domain")


# -----------------------------------------------------------
# BORROWER MODEL
# -----------------------------------------------------------
class Borrower(Base):
    __tablename__ = "borrowers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    domain_id = Column(Integer, ForeignKey("domains.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="borrowers")
    domain = relationship("Domain", back_populates="borrowers")
