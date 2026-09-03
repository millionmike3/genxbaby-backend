from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, nullable=True)
    phone = Column(String(50), nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=True)
    xp = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    domain = relationship("Domain", back_populates="users")


class Domain(Base):
    __tablename__ = "domains"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    brand = Column(String(255), nullable=True)
    owner_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="domain")
    properties = relationship("Property", back_populates="domain")
    bulk_tapes = relationship("BulkTape", back_populates="domain")


class Investor(Base):
    __tablename__ = "investors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Borrower(Base):
    __tablename__ = "borrowers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class BrandProfile(Base):
    __tablename__ = "brand_profiles"

    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String(255), nullable=False)
    bank_name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserVault(Base):
    __tablename__ = "user_vaults"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    domain = relationship("Domain", back_populates="properties")
    bulk_tape_links = relationship("BulkTapeProperty", back_populates="property")


class BulkTape(Base):
    __tablename__ = "bulk_tapes"

    id = Column(Integer, primary_key=True, index=True)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    file_url = Column(Text, nullable=False)
    merkle_root = Column(String(66), nullable=True)
    anchor_tx_hash = Column(String(66), nullable=True)
    anchored_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    domain = relationship("Domain", back_populates="bulk_tapes")
    properties = relationship("BulkTapeProperty", back_populates="bulk_tape")


class BulkTapeProperty(Base):
    __tablename__ = "bulk_tape_properties"

    id = Column(Integer, primary_key=True, index=True)
    bulk_tape_id = Column(Integer, ForeignKey("bulk_tapes.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    bulk_tape = relationship("BulkTape", back_populates="properties")
    property = relationship("Property", back_populates="bulk_tape_links")
