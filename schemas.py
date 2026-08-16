from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


# ============================================================
# USER + AUTH SCHEMAS
# ============================================================
class UserCreate(BaseModel):
    username: str
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str
    role: str  # BORROWER, INVESTOR, OWNER, ADMIN
    domain_id: Optional[int] = None


class UserLogin(BaseModel):
    username: str
    password: str


class XPUpdate(BaseModel):
    xp: int


class UserOut(BaseModel):
    id: int
    username: str
    email: Optional[str]
    phone: Optional[str]
    role: str
    domain_id: Optional[int]
    xp: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# DOMAIN SCHEMAS
# ============================================================
class DomainBase(BaseModel):
    name: str
    brand: Optional[str] = None


class DomainCreate(DomainBase):
    owner_user_id: int


class DomainOut(DomainBase):
    id: int
    owner_user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# INVESTOR / BORROWER SCHEMAS
# ============================================================
class InvestorOut(BaseModel):
    id: int
    user_id: int
    domain_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class BorrowerOut(BaseModel):
    id: int
    user_id: int
    domain_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# BRAND PROFILE SCHEMAS
# ============================================================
class BrandProfileBase(BaseModel):
    domain: str
    bank_name: str
    legal_name: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    support_hours: Optional[str] = None
    pof_header_text: Optional[str] = None
    mortgage_header_text: Optional[str] = None
    check_template: Optional[str] = None


class BrandProfileCreate(BrandProfileBase):
    pass


class BrandProfileUpdate(BrandProfileBase):
    pass


class BrandProfileOut(BrandProfileBase):
    id: int

    class Config:
        from_attributes = True


# ============================================================
# USER VAULT
# ============================================================
class UserVaultOut(BaseModel):
    id: int
    user_id: int
    cash_balance: int
    crypto_balance: int
    reo_equity: int
    domain_value: int
    total_liabilities: int
    encrypted_ledger_blob: Optional[bytes] = None

    class Config:
        from_attributes = True


# ============================================================
# PROPERTY SANITIZER SCHEMAS
# ============================================================
class PropertyBase(BaseModel):
    address: str
    sales_price: int
    noi: Optional[int] = None
    cap_rate: Optional[float] = None
    dscr: Optional[float] = None
    noi_value_ratio: Optional[float] = None
    taxes: Optional[int] = None
    insurance: Optional[int] = None
    units: Optional[int] = None
    property_type: Optional[str] = None


class PropertyCreate(PropertyBase):
    investor_id: Optional[int] = None
    domain_id: int


class PropertyOut(PropertyBase):
    id: int
    domain_id: int
    investor_id: Optional[int]
    sanitizer_status: Optional[str]  # PASS/WATCH/FAIL
    property_signal_score: Optional[int]
    accelerated_pass: Optional[bool]
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# BULK TAPE SCHEMAS
# ============================================================
class BulkTapeOut(BaseModel):
    id: int
    domain_id: int
    admin_id: int
    filename: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


class BulkTapePropertyOut(BaseModel):
    id: int
    bulk_tape_id: int
    property_id: Optional[int]
    raw_data: Any
    sanitized_data: Any
    property_signal_score: Optional[int]
    accelerated_pass: Optional[bool]
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# CREDIT REPORT SUMMARY
# ============================================================
class CreditReportSummaryOut(BaseModel):
    id: int
    borrower_id: int
    application_id: int
    score: int
    utilization: float
    derogatories: int
    tradeline_count: int
    credit_signal_score: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# MORTGAGE APPLICATION
# ============================================================
class MortgageApplicationCreate(BaseModel):
    borrower_id: int
    property_id: int
    loan_amount: int
    loan_purpose: str
    property_type: str


class MortgageApplicationOut(BaseModel):
    id: int
    borrower_id: int
    investor_id: Optional[int]
    domain_id: int
    property_id: int
    loan_amount: int
    status: str
    borrower_signal_score: Optional[int]
    property_signal_score: Optional[int]
    ultra_favorable_signal: Optional[bool]
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# SIGNAL OUTPUTS
# ============================================================
class SignalOut(BaseModel):
    borrower_signal_score: Optional[int]
    property_signal_score: Optional[int]
    ultra_favorable_signal: Optional[bool]


# ============================================================
# PROOF OF FUNDS
# ============================================================
class ProofOfFundsOut(BaseModel):
    user_id: int
    bank_name: str
    capacity_balance: int
    issued_at: str
    verification_id: str
    letter: str

    class Config:
        from_attributes = True


# ============================================================
# LOAN ESTIMATE
# ============================================================
class LoanEstimateCreate(BaseModel):
    interest_rate: float
    term_months: int


class LoanEstimateOut(BaseModel):
    id: int
    mortgage_application_id: int
    loan_amount: int
    interest_rate: float
    term_months: int
    estimated_closing_costs: int
    estimated_prepaids: int
    estimated_escrows: int
    lender_credits: int
    seller_credits: int
    estimated_cash_to_close: int

    class Config:
        from_attributes = True


# ============================================================
# CLOSING DISCLOSURE
# ============================================================
class ClosingDisclosureOut(BaseModel):
    id: int
    mortgage_application_id: int
    final_loan_amount: int
    final_interest_rate: float
    final_term_months: int
    total_closing_costs: int
    total_prepaids: int
    total_escrows: int
    lender_credits: int
    seller_credits: int
    cash_to_close: int

    class Config:
        from_attributes = True


# ============================================================
# DISBURSEMENT CHECKS
# ============================================================
class DisbursementCheckOut(BaseModel):
    id: Optional[int] = None
    payee: str
    amount: int
    purpose: str
    funding_source: str

    class Config:
        from_attributes = True


# ============================================================
# DIGITAL ASSETS
# ============================================================
class DigitalAssetCreate(BaseModel):
    asset_type: str
    identifier: str
    asset_metadata: Optional[str] = None


class DigitalAssetOut(BaseModel):
    id: int
    asset_type: str
    identifier: str
    asset_metadata: Optional[str]
    estimated_value: int

    class Config:
        from_attributes = True
