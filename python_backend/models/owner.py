from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from python_backend.database import Base


class Owner(Base):
    __tablename__ = "owners"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)

    total_properties = Column(Integer, default=0)
    total_equity = Column(Float, default=0.0)
    total_cashflow = Column(Float, default=0.0)

    created_at = Column(DateTime, default=datetime.utcnow)

properties = relationship("Property", back_populates="owner")
