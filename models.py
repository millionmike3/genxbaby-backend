from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# -----------------------------------------------------------
# USER MODEL
# -----------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    borrowers = relationship("Borrower", back_populates="user")
    vaults = relationship("UserVault", back_populates="user")
    assets = relationship("DigitalAsset", back_populates="user")
    brand_profiles = relationship("BrandProfile", back_populates="user")


# -----------------------------------------------------------
# DOMAIN MODEL
# -----------------------------------------------------------
class Domain(Base):
    __tablename__ = "domains"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    borrowers = relationship("Borrower", back_populates="domain")


# -----------------------------------------------------------
# BORROWER MODEL
# -----------------------------------------------------------
class Borrower(Base):
    __tablename__ = "borrowers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    domain_id = Column(Integer, ForeignKey("domains.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="borrowers")
    domain = relationship("Domain", back_populates="borrowers")


# -----------------------------------------------------------
# BRAND PROFILE MODEL
# -----------------------------------------------------------
class BrandProfile(Base):
    __tablename__ = "brand_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    brand_name = Column(String)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="brand_profiles")


# -----------------------------------------------------------
# USER VAULT MODEL
# -----------------------------------------------------------
class UserVault(Base):
    __tablename__ = "user_vaults"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    vault_name = Column(String)
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="vaults")


# -----------------------------------------------------------
# DIGITAL ASSET MODEL
# -----------------------------------------------------------
class DigitalAsset(Base):
    __tablename__ = "digital_assets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    asset_type = Column(String)
    value = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="assets")
