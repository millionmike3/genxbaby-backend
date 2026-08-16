from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime

from database import SessionLocal
from models import (
    MortgageApplication,
    Borrower,
    Investor,
    Domain,
    Property,
    CreditReportSummary,
)
from schemas import (
    MortgageApplicationCreate,
    MortgageApplicationOut,
    SignalOut,
)
from signals import compute_borrower_signal, compute_ultra_favorable_signal
from rbac import require_investor, require_owner, require_admin


router = APIRouter(prefix="/mortgage", tags=["Mortgage LOS"])


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
# CREATE MORTGAGE APPLICATION
# ============================================================
@router.post("/apply", response_model=MortgageApplicationOut)
def create_mortgage_application(
    data: MortgageApplicationCreate,
    db: Session = Depends(get_db)
):
    borrower = db.query(Borrower).filter(Borrower.id == data.borrower_id).first()
    if not borrower:
        raise HTTPException(404, "Borrower not found")

    property_obj = db.query(Property).filter(Property.id == data.property_id).first()
    if not property_obj:
        raise HTTPException(404, "Property not found")

    domain_id = borrower.domain_id

    app = MortgageApplication(
        borrower_id=data.borrower_id,
        investor_id=None,
        domain_id=domain_id,
        property_id=data.property_id,
        loan_amount=data.loan_amount,
        status="STARTED",
        created_at=datetime.utcnow(),
    )

    db.add(app)
    db.commit()
    db.refresh(app)

    return app


# ============================================================
# GET APPLICATION BY ID
# ============================================================
@router.get("/{application_id}", response_model=MortgageApplicationOut)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
):
    app = db.query(MortgageApplication).filter(MortgageApplication.id == application_id).first()
    if not app:
        raise HTTPException(404, "Application not found")

    return app


# ============================================================
# BORROWER SIGNAL GENERATION
# ============================================================
@router.post("/{application_id}/borrower-signal", response_model=SignalOut)
def generate_borrower_signal(
    application_id: int,
    db: Session = Depends(get_db),
):
    app = db.query(MortgageApplication).filter(MortgageApplication.id == application_id).first()
    if not app:
        raise HTTPException(404, "Application not found")

    borrower = db.query(Borrower).filter(Borrower.id == app.borrower_id).first()
    if not borrower:
        raise HTTPException(404, "Borrower not found")

    # Compute borrower signal
    borrower_signal_score = compute_borrower_signal(borrower.id, db)

    app.borrower_signal_score = borrower_signal_score
    db.commit()

    return SignalOut(
        borrower_signal_score=borrower_signal_score,
        property_signal_score=app.property_signal_score,
        ultra_favorable_signal=app.ultra_favorable_signal,
    )


# ============================================================
# PROPERTY SIGNAL RETRIEVAL
# ============================================================
@router.post("/{application_id}/property-signal", response_model=SignalOut)
def attach_property_signal(
    application_id: int,
    db: Session = Depends(get_db),
):
    app = db.query(MortgageApplication).filter(MortgageApplication.id == application_id).first()
    if not app:
        raise HTTPException(404, "Application not found")

    property_obj = db.query(Property).filter(Property.id == app.property_id).first()
    if not property_obj:
        raise HTTPException(404, "Property not found")

    app.property_signal_score = property_obj.property_signal_score
    db.commit()

    return SignalOut(
        borrower_signal_score=app.borrower_signal_score,
        property_signal_score=property_obj.property_signal_score,
        ultra_favorable_signal=app.ultra_favorable_signal,
    )


# ============================================================
# ULTRA FAVORABLE SIGNAL
# ============================================================
@router.post("/{application_id}/ultra-favorable", response_model=SignalOut)
def compute_ultra_favorable(
    application_id: int,
    db: Session = Depends(get_db),
):
    app = db.query(MortgageApplication).filter(MortgageApplication.id == application_id).first()
    if not app:
        raise HTTPException(404, "Application not found")

    if app.borrower_signal_score is None:
        raise HTTPException(400, "Borrower signal not computed yet")

    if app.property_signal_score is None:
        raise HTTPException(400, "Property signal not attached yet")

    ultra = compute_ultra_favorable_signal(
        borrower_score=app.borrower_signal_score,
        property_score=app.property_signal_score,
    )

    app.ultra_favorable_signal = ultra
    if ultra:
        app.status = "CONDITIONAL_CLEAR_TO_CLOSE"

    db.commit()

    return SignalOut(
        borrower_signal_score=app.borrower_signal_score,
        property_signal_score=app.property_signal_score,
        ultra_favorable_signal=ultra,
    )


# ============================================================
# INVESTOR PIPELINE VIEW
# ============================================================
@router.get("/investor/pipeline", response_model=list[MortgageApplicationOut])
def investor_pipeline(
    investor=Depends(require_investor),
    db: Session = Depends(get_db),
):
    apps = db.query(MortgageApplication).filter(
        MortgageApplication.investor_id == investor.id
    ).all()

    return apps


# ============================================================
# OWNER PIPELINE VIEW
# ============================================================
@router.get("/owner/pipeline", response_model=list[MortgageApplicationOut])
def owner_pipeline(
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    apps = db.query(MortgageApplication).filter(
        MortgageApplication.domain_id == owner.domain_id
    ).all()

    return apps


# ============================================================
# MASTER ADMIN PIPELINE VIEW
# ============================================================
@router.get("/admin/pipeline", response_model=list[MortgageApplicationOut])
def admin_pipeline(
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(MortgageApplication).all()
