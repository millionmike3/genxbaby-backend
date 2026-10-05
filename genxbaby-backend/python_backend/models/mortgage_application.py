from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from python_backend.database import Base


class MortgageApplication(Base):
    __tablename__ = "mortgage_applications"

    id = Column(Integer, primary_key=True, index=True)

    borrower_id = Column(Integer, ForeignKey("borrowers.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    mortgage_id = Column(Integer, ForeignKey("mortgages.id"), nullable=True)

    application_status = Column(String, default="SUBMITTED")  
    # SUBMITTED / REVIEW / APPROVED / DECLINED

    loan_amount_requested = Column(Float, nullable=True)
    notes = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    borrower = relationship("Borrower", back_populates="mortgage_applications")
    property = relationship("Property", back_populates="mortgage_applications")
    mortgage = relationship("Mortgage", back_populates="applications")
