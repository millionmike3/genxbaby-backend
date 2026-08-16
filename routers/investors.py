from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from database import SessionLocal
from models import User, Investor, MortgageApplication, Property, Domain
from schemas import InvestorOut, UserCreate, UserOut
from rbac import require_admin, require_owner, require_investor


router = APIRouter(prefix="/investors", tags=["Investors"])


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
# ADMIN CREATES INVESTOR USER + INVESTOR PROFILE
# ============================================================
@router.post("/admin/create", response_model=InvestorOut)
def admin_create_investor(
    data: UserCreate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Admin creates an investor user and assigns them to a domain.
    """

    if data.role != "INVESTOR":
        raise HTTPException(400, "Role must be INVESTOR")

    # Create user
    user = User(
        username=data.username,
        email=data.email,
        phone=data.phone,
        password_hash=data.password,
        role="INVESTOR",
        domain_id=data.domain_id,
        created_at=datetime.utcnow(),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Create investor profile
    investor = Investor(
        user_id=user.id,
        domain_id=data.domain_id,
        created_at=datetime.utcnow(),
    )

    db.add(investor)
    db.commit()
    db.refresh(investor)

    return investor


# ============================================================
# OWNER CREATES INVESTOR FOR THEIR DOMAIN
# ============================================================
@router.post("/owner/create", response_model=InvestorOut)
def owner_create_investor(
    data: UserCreate,
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    """
    Owner creates an investor under their domain.
    """

    if data.role != "INVESTOR":
        raise HTTPException(400, "Role must be INVESTOR")

    if data.domain_id != owner.domain_id:
        raise HTTPException(403, "Cannot assign investor to another domain")

    # Create user
    user = User(
        username=data.username,
        email=data.email,
        phone=data.phone,
        password_hash=data.password,
        role="INVESTOR",
        domain_id=owner.domain_id,
        created_at=datetime.utcnow(),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Create investor profile
    investor = Investor(
        user_id=user.id,
        domain_id=owner.domain_id,
        created_at=datetime.utcnow(),
    )

    db.add(investor)
    db.commit()
    db.refresh(investor)

    return investor


# ============================================================
# INVESTOR VIEW THEIR PROFILE
# ============================================================
@router.get("/me", response_model=InvestorOut)
def investor_me(
    investor=Depends(require_investor),
):
    return investor


# ============================================================
# OWNER VIEW ALL INVESTORS IN THEIR DOMAIN
# ============================================================
@router.get("/owner/list", response_model=list[InvestorOut])
def owner_list_investors(
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    investors = db.query(Investor).filter(
        Investor.domain_id == owner.domain_id
    ).all()

    return investors


# ============================================================
# ADMIN VIEW ALL INVESTORS
# ============================================================
@router.get("/admin/list", response_model=list[InvestorOut])
def admin_list_investors(
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(Investor).all()


# ============================================================
# INVESTOR PIPELINE (Mortgage Applications)
# ============================================================
@router.get("/pipeline", response_model=list)
def investor_pipeline(
    investor=Depends(require_investor),
    db: Session = Depends(get_db),
):
    apps = db.query(MortgageApplication).filter(
        MortgageApplication.investor_id == investor.id
    ).all()

    return apps


# ============================================================
# INVESTOR PROPERTY LIST
# ============================================================
@router.get("/properties", response_model=list)
def investor_properties(
    investor=Depends(require_investor),
    db: Session = Depends(get_db),
):
    props = db.query(Property).filter(
        Property.investor_id == investor.id
    ).all()

    return props


# ============================================================
# OWNER ASSIGNS INVESTOR TO MORTGAGE APPLICATION
# ============================================================
@router.post("/owner/assign/{application_id}/{investor_id}")
def owner_assign_investor(
    application_id: int,
    investor_id: int,
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    investor = db.query(Investor).filter(Investor.id == investor_id).first()
    if not investor:
        raise HTTPException(404, "Investor not found")

    if investor.domain_id != owner.domain_id:
        raise HTTPException(403, "Investor not in your domain")

    app = db.query(MortgageApplication).filter(
        MortgageApplication.id == application_id
    ).first()

    if not app:
        raise HTTPException(404, "Application not found")

    if app.domain_id != owner.domain_id:
        raise HTTPException(403, "Application not in your domain")

    app.investor_id = investor.id
    db.commit()

    return {"message": "Investor assigned successfully"}


# ============================================================
# ADMIN DELETE INVESTOR
# ============================================================
@router.delete("/admin/delete/{investor_id}")
def admin_delete_investor(
    investor_id: int,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    investor = db.query(Investor).filter(Investor.id == investor_id).first()
    if not investor:
        raise HTTPException(404, "Investor not found")

    user = db.query(User).filter(User.id == investor.user_id).first()

    db.delete(investor)
    if user:
        db.delete(user)

    db.commit()

    return {"message": "Investor deleted"}
