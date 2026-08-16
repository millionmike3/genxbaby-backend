from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db

from models import (
    User,
    Domain,
    Investor,
    Borrower,
    Property,
    BulkTape,
    BulkTapeProperty,
    MortgageApplication,
    CreditReportSummary,
    UserVault,
    DigitalAsset
)

router = APIRouter(
    prefix="/panels",
    tags=["Panels / Dashboards"]
)

# -----------------------------------------------------------
# ADMIN PANEL SUMMARY
# -----------------------------------------------------------
@router.get("/admin")
def admin_panel(db: Session = Depends(get_db)):
    return {
        "total_users": db.query(User).count(),
        "total_domains": db.query(Domain).count(),
        "total_investors": db.query(Investor).count(),
        "total_borrowers": db.query(Borrower).count(),
        "total_properties": db.query(Property).count(),
        "total_bulk_tapes": db.query(BulkTape).count(),
        "total_mortgage_applications": db.query(MortgageApplication).count(),
        "total_credit_reports": db.query(CreditReportSummary).count(),
        "total_digital_assets": db.query(DigitalAsset).count(),
    }

# -----------------------------------------------------------
# DOMAIN PANEL SUMMARY
# -----------------------------------------------------------
@router.get("/domain/{domain_id}")
def domain_panel(domain_id: int, db: Session = Depends(get_db)):
    domain = db.query(Domain).filter(Domain.id == domain_id).first()
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")

    return {
        "domain_id": domain.id,
        "domain_name": domain.name,
        "brand": domain.brand,
        "total_users": len(domain.users),
