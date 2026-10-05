from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from python_backend.database import Base


class Borrower(Base):
    __tablename__ = "borrowers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)

    ssn = Column(String, nullable=True)
    dob = Column(String, nullable=True)

    annual_income = Column(Float, nullable=True)
    employment_status = Column(String, nullable=True)
    employer_name = Column(String, nullable=True)

    credit_score = Column(Integer, nullable=True)
    dti_ratio = Column(Float, nullable=True)
    cashflow_score = Column(Float, nullable=True)
    fraud_score = Column(Float, nullable=True)
    behavior_score = Column(Float, nullable=True)
    financial_health_score = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    mortgages = relationship("Mortgage", back_populates="borrower")
    underwriting_cases = relationship("UnderwritingCase", back_populates="borrower")

    mortgage_applications = relationship(
        "MortgageApplication",
        back_populates="borrower",
        cascade="all, delete-orphan",
    )
