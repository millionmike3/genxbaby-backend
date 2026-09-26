from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from python_backend.database import Base


class Mortgage(Base):
    __tablename__ = "mortgages"

    id = Column(Integer, primary_key=True, index=True)

    borrower_id = Column(Integer, ForeignKey("borrowers.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)

    loan_amount = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=True)
    term_months = Column(Integer, nullable=True)

    status = Column(String, default="PENDING")  # PENDING / APPROVED / DECLINED
    underwriting_case_id = Column(Integer, ForeignKey("underwriting_cases.id"))

    created_at = Column(DateTime, default=datetime.utcnow)

    borrower = relationship("Borrower", back_populates="mortgages")
    property = relationship("Property", back_populates="mortgages")
    underwriting_case = relationship("UnderwritingCase", back_populates="mortgage")
