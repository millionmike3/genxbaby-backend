from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from python_backend.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("admins.id"))
    role = Column(String)
    action = Column(String)
    payload_json = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    session_id = Column(String)
    hash = Column(String)
