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
    """Used when creating a brand profile"""
    pass


class BrandProfileOut(BrandProfileBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
