from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from python_backend.database import Base


class UnderwritingCase(Base):
    __tablename__ = "underwriting_cases"

    id = Column(Integer, primary_key=True, index=True)

    borrower_id = Column(Integer, ForeignKey("borrowers.id"), nullable=False)
    mortgage_id = Column(Integer, ForeignKey("mortgages.id"), nullable=False)

    risk_score = Column(Float, nullable=True)
    collateral_score = Column(Float, nullable=True)
    behavior_score = Column(Float, nullable=True)
    fraud_score = Column(Float, nullable=True)
    financial_health_score = Column(Float, nullable=True)

    valuation_amount = Column(Float, nullable=True)
    pricing_output = Column(Float, nullable=True)

    decision = Column(String, default="PENDING")  # APPROVED / DECLINED / REVIEW
    decision_reason = Column(String, nullable=True)

    merkle_root = Column(String, nullable=True)
    blockchain_tx = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    borrower = relationship("Borrower", back_populates="underwriting_cases")
    mortgage = relationship("Mortgage", back_populates="underwriting_case")
