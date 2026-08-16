from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime

from database import Base, engine, SessionLocal
from models import User, BrandProfile, UserVault, DigitalAsset
from schemas import (
    UserCreate,
    UserLogin,
    UserOut,
    BrandProfileCreate,
    BrandProfileOut,
    UserVaultOut,
    DigitalAssetCreate,
    DigitalAssetOut,
)
from rbac import get_current_user

# Routers
from routers.domains import router as domains_router
from routers.owners import router as owners_router
from routers.investors import router as investors_router
from routers.borrowers import router as borrowers_router
from routers.mortgage import router as mortgage_router
from routers.property_sanitizer import router as property_router
from routers.bulk_tape import router as bulk_tape_router
from routers.credit import router as credit_router
from routers.underwriting import router as underwriting_router
from routers.panels import router as panels_router


# ============================================================
# APP INIT
# ============================================================
app = FastAPI(
    title="Resilient America Lending OS",
    description="Multi-tenant mortgage + property underwriting platform for investors, owners, and borrowers.",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


# ============================================================
# DB DEPENDENCY
# ============================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================
# ROOT
# ============================================================
@app.get("/")
def root():
    return {
        "message": "Resilient America Lending OS is live.",
        "modules": [
            "auth",
            "domains",
            "owners",
            "investors",
            "borrowers",
            "mortgage",
            "property_sanitizer",
            "bulk_tape",
            "credit",
            "underwriting",
            "panels",
        ],
    }


# ============================================================
# AUTH / USERS
# ============================================================
@app.post("/auth/register", response_model=UserOut)
def register_user(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == data.username).first()
    if existing:
        raise HTTPException(400, "Username already taken")

    user = User(
        username=data.username,
        email=data.email,
        phone=data.phone,
        password_hash=data.password,  # TODO: hash this
        role=data.role,
        domain_id=data.domain_id,
        created_at=datetime.utcnow(),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Create empty vault
    vault = UserVault(user_id=user.id)
    db.add(vault)
    db.commit()

    return user


@app.post("/auth/login", response_model=UserOut)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or user.password_hash != data.password:
        raise HTTPException(401, "Invalid credentials")

    return user


@app.get("/auth/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user


# ============================================================
# BRAND PROFILE
# ============================================================
@app.post("/brand", response_model=BrandProfileOut)
def create_brand(data: BrandProfileCreate, db: Session = Depends(get_db)):
    brand = BrandProfile(**data.dict())
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand


@app.get("/brand/{domain}", response_model=BrandProfileOut)
def get_brand(domain: str, db: Session = Depends(get_db)):
    brand = db.query(BrandProfile).filter(BrandProfile.domain == domain).first()
    if not brand:
        raise HTTPException(404, "Brand not found")
    return brand


# ============================================================
# USER VAULT
# ============================================================
@app.get("/vault/me", response_model=UserVaultOut)
def my_vault(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    vault = db.query(UserVault).filter(UserVault.user_id == current_user.id).first()
    if not vault:
        raise HTTPException(404, "Vault not found")
    return vault


# ============================================================
# DIGITAL ASSETS
# ============================================================
@app.post("/digital-assets", response_model=DigitalAssetOut)
def add_digital_asset(
    data: DigitalAssetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    asset = DigitalAsset(
        user_id=current_user.id,
        asset_type=data.asset_type,
        identifier=data.identifier,
        asset_metadata=data.asset_metadata,
        estimated_value=0,
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


@app.get("/digital-assets", response_model=list[DigitalAssetOut])
def list_digital_assets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(DigitalAsset).filter(DigitalAsset.user_id == current_user.id).all()


# ============================================================
# INCLUDE MODULE ROUTERS
# ============================================================
app.include_router(domains_router)
app.include_router(owners_router)
app.include_router(investors_router)
app.include_router(borrowers_router)
app.include_router(mortgage_router)
app.include_router(property_router)
app.include_router(bulk_tape_router)
app.include_router(credit_router)
app.include_router(underwriting_router)
app.include_router(panels_router)
