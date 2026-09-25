from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from database import SessionLocal
from models import (
    User,
    Domain,
    Investor,
    Borrower,
    Property,
    MortgageApplication,
    BulkTape,
)
from schemas import UserCreate, UserOut
from rbac import require_admin, require_owner


router = APIRouter(prefix="/owners", tags=["Owners"])


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
# ADMIN CREATES OWNER USER + ASSIGNS DOMAIN
# ============================================================
@router.post("/admin/create", response_model=UserOut)
def admin_create_owner(
    data: UserCreate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Admin creates an OWNER user and assigns them to a domain.
    """

    if data.role != "OWNER":
        raise HTTPException(400, "Role must be OWNER")

    domain = db.query(Domain).filter(Domain.id == data.domain_id).first()
    if not domain:
        raise HTTPException(404, "Domain not found")

    # Create user
    user = User(
        username=data.username,
        email=data.email,
        phone=data.phone,
        password_hash=data.password,
        role="OWNER",
        domain_id=data.domain_id,
        created_at=datetime.utcnow(),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Assign owner to domain
    domain.owner_user_id = user.id
    db.commit()

    return user


# ============================================================
# OWNER VIEW THEIR PROFILE
# ============================================================
@router.get("/me", response_model=UserOut)
def owner_me(
    owner=Depends(require_owner),
):
    return owner


# ============================================================
# OWNER VIEW DOMAIN DETAILS
# ============================================================
@router.get("/domain", response_model=dict)
def owner_domain_details(
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    domain = db.query(Domain).filter(Domain.id == owner.domain_id).first()
    if not domain:
        raise HTTPException(404, "Domain not found")

    return {
        "domain_id": domain.id,
        "domain_name": domain.name,
        "brand": domain.brand,
        "owner_user_id": domain.owner_user_id,
        "created_at": domain.created_at,
    }


# ============================================================
# OWNER VIEW INVESTORS IN THEIR DOMAIN
# ============================================================
@router.get("/investors", response_model=list)
def owner_investors(
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    investors = db.query(Investor).filter(
        Investor.domain_id == owner.domain_id
    ).all()

    return investors


# ============================================================
# OWNER VIEW BORROWERS IN THEIR DOMAIN
# ============================================================
@router.get("/borrowers", response_model=list)
def owner_borrowers(
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    borrowers = db.query(Borrower).filter(
        Borrower.domain_id == owner.domain_id
    ).all()

    return borrowers


# ============================================================
# OWNER VIEW PROPERTIES IN THEIR DOMAIN
# ============================================================
@router.get("/properties", response_model=list)
def owner_properties(
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    props = db.query(Property).filter(
        Property.domain_id == owner.domain_id
    ).all()

    return props


# ============================================================
# OWNER VIEW MORTGAGE PIPELINE FOR THEIR DOMAIN
# ============================================================
@router.get("/pipeline", response_model=list)
def owner_pipeline(
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    apps = db.query(MortgageApplication).filter(
        MortgageApplication.domain_id == owner.domain_id
    ).all()

    return apps


# ============================================================
# OWNER VIEW BULK TAPES FOR THEIR DOMAIN
# ============================================================
@router.get("/bulk-tapes", response_model=list)
def owner_bulk_tapes(
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    tapes = db.query(BulkTape).filter(
        BulkTape.domain_id == owner.domain_id
    ).all()

    return tapes


# ============================================================
# OWNER ANALYTICS (STARTER VERSION)
# ============================================================
@router.get("/analytics", response_model=dict)
def owner_analytics(
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    domain_id = owner.domain_id

    total_investors = db.query(Investor).filter(
        Investor.domain_id == domain_id
    ).count()

    total_borrowers = db.query(Borrower).filter(
        Borrower.domain_id == domain_id
    ).count()

    total_properties = db.query(Property).filter(
        Property.domain_id == domain_id
    ).count()

    total_applications = db.query(MortgageApplication).filter(
        MortgageApplication.domain_id == domain_id
    ).count()

    passes = db.query(Property).filter(
        Property.domain_id == domain_id,
        Property.sanitizer_status == "PASS"
    ).count()

    watch = db.query(Property).filter(
        Property.domain_id == domain_id,
        Property.sanitizer_status == "WATCH"
    ).count()

    fails = db.query(Property).filter(
        Property.domain_id == domain_id,
        Property.sanitizer_status == "FAIL"
    ).count()

    return {
        "domain_id": domain_id,
        "total_investors": total_investors,
        "total_borrowers": total_borrowers,
        "total_properties": total_properties,
        "total_applications": total_applications,
        "property_pass": passes,
        "property_watch": watch,
        "property_fail": fails,
    }


# ============================================================
# ADMIN LIST ALL OWNERS
# ============================================================
@router.get("/admin/list", response_model=list[UserOut])
def admin_list_owners(
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    owners = db.query(User).filter(User.role == "OWNER").all()
    return owners


# ============================================================
# ADMIN DELETE OWNER
# ============================================================
@router.delete("/admin/delete/{owner_id}")
def admin_delete_owner(
    owner_id: int,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    owner = db.query(User).filter(User.id == owner_id, User.role == "OWNER").first()
    if not owner:
        raise HTTPException(404, "Owner not found")

    # Remove domain assignment
    domain = db.query(Domain).filter(Domain.owner_user_id == owner_id).first()
    if domain:
        domain.owner_user_id = None

    db.delete(owner)
    db.commit()

    return {"message": "Owner deleted"}
