from pydantic import BaseModel
from typing import Optional
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

class BrandProfileCreate(BrandProfileBase):
    pass

class BrandProfileUpdate(BaseModel):
    domain: Optional[str] = None
    bank_name: Optional[str] = None

class BrandProfileOut(BrandProfileBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ============================================================
# PROPERTY SCHEMAS
# ============================================================
class PropertyBase(BaseModel):
    address: str
    price: float
    domain_id: int

class PropertyCreate(PropertyBase):
    pass

class PropertyOut(PropertyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ============================================================
# BULK TAPE SCHEMAS
# ============================================================
class BulkTapeOut(BaseModel):
    id: int
    domain_id: int
    file_url: str
    created_at: datetime

    class Config:
        from_attributes = True

# ============================================================
# BULK TAPE PROPERTY SCHEMAS
# ============================================================
class BulkTapePropertyBase(BaseModel):
    bulk_tape_id: int
    address: str
    price: float
    domain_id: int

class BulkTapePropertyCreate(BulkTapePropertyBase):
    pass

class BulkTapePropertyUpdate(BaseModel):
    bulk_tape_id: Optional[int] = None
    address: Optional[str] = None
    price: Optional[float] = None
    domain_id: Optional[int] = None

class BulkTapePropertyOut(BulkTapePropertyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ============================================================
# USER VAULT SCHEMAS
# ============================================================
class UserVaultOut(BaseModel):
    id: int
    user_id: int
    balance: float
    created_at: datetime

    class Config:
        from_attributes = True

# ============================================================
# CREDIT REPORT SUMMARY SCHEMAS
# ============================================================
class CreditReportSummaryBase(BaseModel):
    user_id: int
    domain_id: int
    score: int
    provider: str

class CreditReportSummaryCreate(CreditReportSummaryBase):
    pass

class CreditReportSummaryUpdate(BaseModel):
    score: Optional[int] = None
    provider: Optional[str] = None

class CreditReportSummaryOut(CreditReportSummaryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ============================================================
# MORTGAGE APPLICATION SCHEMAS
# ============================================================
class MortgageApplicationBase(BaseModel):
    user_id: int
    domain_id: int
    property_id: int
    loan_amount: float
    status: str  # PENDING, APPROVED, REJECTED

class MortgageApplicationCreate(MortgageApplicationBase):
    pass

class MortgageApplicationUpdate(BaseModel):
    loan_amount: Optional[float] = None
    status: Optional[str] = None

class MortgageApplicationOut(MortgageApplicationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ============================================================
# SIGNAL SCHEMAS
# ============================================================
class SignalBase(BaseModel):
    user_id: int
    domain_id: int
    type: str
    message: str

class SignalCreate(SignalBase):
    pass

class SignalUpdate(BaseModel):
    type: Optional[str] = None
    message: Optional[str] = None

class SignalOut(SignalBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ============================================================
# PROOF OF FUNDS SCHEMAS
# ============================================================
class ProofOfFundsBase(BaseModel):
    user_id: int
    domain_id: int
    amount: float
    institution: str

class ProofOfFundsCreate(ProofOfFundsBase):
    pass

class ProofOfFundsUpdate(BaseModel):
    amount: Optional[float] = None
    institution: Optional[str] = None

class ProofOfFundsOut(ProofOfFundsBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
# ============================================================
# LOAN ESTIMATE SCHEMAS
# ============================================================
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LoanEstimateBase(BaseModel):
    user_id: int
    domain_id: int
    property_id: int
    loan_amount: float
    interest_rate: float
    term_months: int

class LoanEstimateCreate(LoanEstimateBase):
    pass

class LoanEstimateUpdate(BaseModel):
    loan_amount: Optional[float] = None
    interest_rate: Optional[float] = None
    term_months: Optional[int] = None

class LoanEstimateOut(LoanEstimateBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
# ============================================================
# CLOSING DISCLOSURE SCHEMAS
# ============================================================
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClosingDisclosureBase(BaseModel):
    user_id: int
    domain_id: int
    property_id: int
    loan_amount: float
    closing_costs: float
    cash_to_close: float

class ClosingDisclosureCreate(ClosingDisclosureBase):
    pass

class ClosingDisclosureUpdate(BaseModel):
    loan_amount: Optional[float] = None
    closing_costs: Optional[float] = None
    cash_to_close: Optional[float] = None

class ClosingDisclosureOut(ClosingDisclosureBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
# ============================================================
# DISBURSEMENT CHECK SCHEMAS
# ============================================================
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DisbursementCheckBase(BaseModel):
    user_id: int
    domain_id: int
    amount: float
    payee: str
    memo: Optional[str] = None

class DisbursementCheckCreate(DisbursementCheckBase):
    pass

class DisbursementCheckUpdate(BaseModel):
    amount: Optional[float] = None
    payee: Optional[str] = None
    memo: Optional[str] = None

class DisbursementCheckOut(DisbursementCheckBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
