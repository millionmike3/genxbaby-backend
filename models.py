from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship

from database import Base


# ============================================================
# USER MODEL
# ============================================================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)

    # BORROWER, INVESTOR, OWNER, ADMIN
    role = Column(String, nullable=False)

    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=True)

    xp = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    domain = relationship(
        "Domain",
        back_populates="users",
        foreign_keys=[domain_id],
    )

    vault = relationship(
        "UserVault",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    digital_assets = relationship(
        "DigitalAsset",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    borrowers = relationship(
        "Borrower",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    investors = relationship(
        "Investor",
        back_populates="user",
        cascade="all, delete-orphan",
    )


# ============================================================
# DOMAIN MODEL
# ============================================================
class Domain(Base):
    __tablename__ = "domains"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=True)
    owner_user_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship(
        "User",
        back_populates="domain",
        foreign_keys=[User.domain_id],
    )

    owner = relationship(
        "User",
        foreign_keys=[owner_user_id],
    )

    properties = relationship(
        "Property",
        back_populates="domain",
        cascade="all, delete-orphan",
    )

    investors = relationship(
        "Investor",
        back_populates="domain",
        cascade="all, delete-orphan",
    )

    borrowers = relationship(
        "Borrower",
        back_populates="domain",
        cascade="all, delete-orphan",
    )

    bulk_tapes = relationship(
        "BulkTape",
        back_populates="domain",
        cascade="all, delete-orphan",
    )


# ============================================================
# INVESTOR MODEL
# ============================================================
class Investor(Base):
    __tablename__ = "investors"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    domain = relationship("Domain", back_populates="investors")
    user = relationship("User", back_populates="investors")

    properties = relationship(
        "Property",
        back_populates="investor",
        cascade="all, delete-orphan",
    )

    mortgage_applications = relationship(
        "MortgageApplication",
        back_populates="investor",
        cascade="all, delete-orphan",
    )


# ============================================================
# BORROWER MODEL
# ============================================================
class Borrower(Base):
    __tablename__ = "borrowers"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    domain = relationship("Domain", back_populates="borrowers")
    user = relationship("User", back_populates="borrowers")

    credit_reports = relationship(
        "CreditReportSummary",
        back_populates="borrower",
        cascade="all, delete-orphan",
    )

    mortgage_applications = relationship(
        "MortgageApplication",
        back_populates="borrower",
        cascade="all, delete-orphan",
    )


# ============================================================
# BRAND PROFILE
# ============================================================
class BrandProfile(Base):
    __tablename__ = "brand_profiles"

    id = Column(Integer, primary_key=True)
    domain = Column(String, unique=True, nullable=False)
    bank_name = Column(String, nullable=False)
    legal_name = Column(String)
    logo_url = Column(String)
    primary_color = Column(String)
    secondary_color = Column(String)
    contact_email = Column(String)
    contact_phone = Column(String)
    address = Column(String)
    support_hours = Column(String)
    pof_header_text = Column(String)
    mortgage_header_text = Column(String)
    check_template = Column(String)


# ============================================================
# USER VAULT
# ============================================================
class UserVault(Base):
    __tablename__ = "user_vaults"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    cash_balance = Column(Integer, default=0)
    crypto_balance = Column(Integer, default=0)
    reo_equity = Column(Integer, default=0)
    domain_value = Column(Integer, default=0)
    total_liabilities = Column(Integer, default=0)

    encrypted_ledger_blob = Column(String, nullable=True)

    user = relationship("User", back_populates="vault")


# ============================================================
# PROPERTY MODEL (SANITIZER)
# ============================================================
class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    investor_id = Column(Integer, ForeignKey("investors.id"), nullable=True)

    address = Column(String, nullable=False)
    sales_price = Column(Integer, nullable=False)

    noi = Column(Integer, nullable=True)
    cap_rate = Column(Float, nullable=True)
    dscr = Column(Float, nullable=True)
    noi_value_ratio = Column(Float, nullable=True)

    taxes = Column(Integer, nullable=True)
    insurance = Column(Integer, nullable=True)
    units = Column(Integer, nullable=True)
    property_type = Column(String, nullable=True)

    sanitizer_status = Column(String, nullable=True)  # PASS/WATCH/FAIL
    property_signal_score = Column(Integer, nullable=True)
    accelerated_pass = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    domain = relationship("Domain", back_populates="properties")
    investor = relationship("Investor", back_populates="properties")

    bulk_tape_properties = relationship(
        "BulkTapeProperty",
        back_populates="property",
        cascade="all, delete-orphan",
    )

    mortgage_applications = relationship(
        "MortgageApplication",
        back_populates="property",
        cascade="all, delete-orphan",
    )


# ============================================================
# BULK TAPE
# ============================================================
class BulkTape(Base):
    __tablename__ = "bulk_tapes"

    id = Column(Integer, primary_key=True)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    domain = relationship("Domain", back_populates="bulk_tapes")
    properties = relationship(
        "BulkTapeProperty",
        back_populates="bulk_tape",
        cascade="all, delete-orphan",
    )


# ============================================================
# BULK TAPE PROPERTY
# ============================================================
class BulkTapeProperty(Base):
    __tablename__ = "bulk_tape_properties"

    id = Column(Integer, primary_key=True)
    bulk_tape_id = Column(Integer, ForeignKey("bulk_tapes.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)

    raw_data = Column(JSON)
    sanitized_data = Column(JSON)

    property_signal_score = Column(Integer, nullable=True)
    accelerated_pass = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    bulk_tape = relationship("BulkTape", back_populates="properties")
    property = relationship("Property", back_populates="bulk_tape_properties")


# ============================================================
# CREDIT REPORT SUMMARY
# ============================================================
class CreditReportSummary(Base):
    __tablename__ = "credit_reports"

    id = Column(Integer, primary_key=True)
    borrower_id = Column(Integer, ForeignKey("borrowers.id"), nullable=False)
    application_id = Column(Integer, ForeignKey("mortgage_applications.id"), nullable=False)

    score = Column(Integer)
    utilization = Column(Float)
    derogatories = Column(Integer)
    tradeline_count = Column(Integer)
    credit_signal_score = Column(Integer)

    created_at = Column(DateTime, default=datetime.utcnow)

    borrower = relationship("Borrower", back_populates="credit_reports")
    application = relationship("MortgageApplication", back_populates="credit_report")


# ============================================================
# MORTGAGE APPLICATION
# ============================================================
class MortgageApplication(Base):
    __tablename__ = "mortgage_applications"

    id = Column(Integer, primary_key=True)
    borrower_id = Column(Integer, ForeignKey("borrowers.id"), nullable=False)
    investor_id = Column(Integer, ForeignKey("investors.id"), nullable=True)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)

    loan_amount = Column(Integer, nullable=False)
    status = Column(String, default="STARTED")

    borrower_signal_score = Column(Integer, nullable=True)
    property_signal_score = Column(Integer, nullable=True)
    ultra_favorable_signal = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    borrower = relationship("Borrower", back_populates="mortgage_applications")
    investor = relationship("Investor", back_populates="mortgage_applications")
    domain = relationship("Domain")
    property = relationship("Property", back_populates="mortgage_applications")
    credit_report = relationship(
        "CreditReportSummary",
        back_populates="application",
        uselist=False,
        cascade="all, delete-orphan",
    )


# ============================================================
# DIGITAL ASSETS
# ============================================================
class DigitalAsset(Base):
    __tablename__ = "digital_assets"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    asset_type = Column(String)
    identifier = Column(String)
    asset_metadata = Column(String)
    estimated_value = Column(Integer)

    user = relationship("User", back_populates="digital_assets")
