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
    role: str
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
    # ============================================================
# BULK TAPE PROPERTY SCHEMAS
# ============================================================
from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class BulkTapePropertyBase(BaseModel):
    bulk_tape_id: int     # link to BulkTapeOut
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


    class Config:
        from_attributes = True
