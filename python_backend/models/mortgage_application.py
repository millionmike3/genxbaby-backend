from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from python_backend.database import Base

class MortgageApplication(Base):
    __tablename__ = "mortgage_applications"

    id = Column(Integer, primary_key=True, index=True)

    # Link to borrower
    borrower_id = Column(Integer, ForeignKey("borrowers.id"), nullable=False)
    borrower = relationship("Borrower", back_populates="mortgage_applications")

    # Basic applicant info
    full_name = Column(String, nullable=False)
    dob = Column(String, nullable=True)
    ssn = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)

    # Employment & income
    employment_status = Column(String, nullable=True)
    base_income = Column(Float, default=0)
    gig_income = Column(Float, default=0)
    referral_income = Column(Float, default=0)
    other_income = Column(Float, default=0)

    # Debts
    monthly_debt = Column(Float, default=0)

    # Property details
    loan_purpose = Column(String, nullable=True)
    property_type = Column(String, nullable=True)
    property_value = Column(Float, nullable=True)
    requested_loan_amount = Column(Float, nullable=True)

    # Underwriting signals
    signals_json = Column(Text, nullable=True)

    # Status
    status = Column(String, default="pending")
