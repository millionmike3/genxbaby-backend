from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from python_backend.database import Base


class Investor(Base):
    __tablename__ = "investors"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)

    total_invested = Column(Float, default=0.0)
    total_returns = Column(Float, default=0.0)
    active_positions = Column(Integer, default=0)

    risk_tolerance = Column(String, nullable=True)
    investment_strategy = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
