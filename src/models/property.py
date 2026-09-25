from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from src.database import Base


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("owners.id"), nullable=True)

    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zipcode = Column(String, nullable=False)

    property_type = Column(String, nullable=True)
    square_feet = Column(Integer, nullable=True)
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(Float, nullable=True)

    market_value = Column(Float, nullable=True)
    valuation_confidence = Column(Float, nullable=True)

    cap_rate = Column(Float, nullable=True)
    noi = Column(Float, nullable=True)
    dscr = Column(Float, nullable=True)

    sanitizer_pass = Column(Boolean, default=False)
    sanitizer_reason = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("Owner", back_populates="properties")
    mortgages = relationship("Mortgage", back_populates="property")

