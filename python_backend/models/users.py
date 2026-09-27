from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from python_backend.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    # Relationships
    borrower_profile = relationship("Borrower", back_populates="user", uselist=False)
    investor_profile = relationship("Investor", back_populates="user", uselist=False)
    domain = relationship("Domain", back_populates="owner", uselist=False)


class Borrower(Base):
    __tablename__ = "borrowers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Example borrower fields
    credit_score = Column(Integer, nullable=True)
    income = Column(Integer, nullable=True)

    user = relationship("User", back_populates="borrower_profile")


class Investor(Base):
    __tablename__ = "investors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Example investor fields
    capital = Column(Integer, nullable=True)
    risk_tolerance = Column(String, nullable=True)

    user = relationship("User", back_populates="investor_profile")


class Domain(Base):
    __tablename__ = "domains"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    domain_name = Column(String, unique=True, nullable=False)

    owner = relationship("User", back_populates="domain")
