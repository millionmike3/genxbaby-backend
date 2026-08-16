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
        "total_investors": len(domain.investors),
        "total_borrowers": len(domain.borrowers),
        "total_properties": len(domain.properties),
        "total_bulk_tapes": len(domain.bulk_tapes),
    }

# -----------------------------------------------------------
# INVESTOR PANEL SUMMARY
# -----------------------------------------------------------
@router.get("/investor/{user_id}")
def investor_panel(user_id: int, db: Session = Depends(get_db)):
    investor = db.query(Investor).filter(Investor.user_id == user_id).first()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")

    properties = db.query(Property).filter(Property.investor_id == investor.id).count()
    applications = db.query(MortgageApplication).filter(MortgageApplication.investor_id == investor.id).count()

    return {
        "investor_id": investor.id,
        "domain_id": investor.domain_id,
        "total_properties": properties,
        "total_mortgage_applications": applications,
    }

# -----------------------------------------------------------
# BORROWER PANEL SUMMARY
# -----------------------------------------------------------
@router.get("/borrower/{user_id}")
def borrower_panel(user_id: int, db: Session = Depends(get_db)):
    borrower = db.query(Borrower).filter(Borrower.user_id == user_id).first()
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")

    applications = db.query(MortgageApplication).filter(
        MortgageApplication.borrower_id == borrower.id
    ).count()

    credit_reports = db.query(CreditReportSummary).filter(
        CreditReportSummary.borrower_id == borrower.id
    ).count()

    return {
        "borrower_id": borrower.id,
        "domain_id": borrower.domain_id,
        "total_mortgage_applications": applications,
        "total_credit_reports": credit_reports,
    }

# -----------------------------------------------------------
# OWNER PANEL SUMMARY
# -----------------------------------------------------------
@router.get("/owner/{user_id}")
def owner_panel(user_id: int, db: Session = Depends(get_db)):
    domain = db.query(Domain).filter(Domain.owner_user_id == user_id).first()
    if not domain:
        raise HTTPException(status_code=404, detail="Owner domain not found")

    return {
        "owner_user_id": user_id,
        "domain_id": domain.id,
        "domain_name": domain.name,
        "total_users": len(domain.users),
        "total_properties": len(domain.properties),
        "total_investors": len(domain.investors),
        "total_borrowers": len(domain.borrowers),
    }

# -----------------------------------------------------------
# USER VAULT PANEL
# -----------------------------------------------------------
@router.get("/vault/{user_id}")
def vault_panel(user_id: int, db: Session = Depends(get_db)):
    vault = db.query(UserVault).filter(UserVault.user_id == user_id).first()
    if not vault:
        raise HTTPException(status_code=404, detail="Vault not found")

    return {
        "cash_balance": vault.cash_balance,
        "crypto_balance": vault.crypto_balance,
        "reo_equity": vault.reo_equity,
        "domain_value": vault.domain_value,
        "total_liabilities": vault.total_liabilities,
    }

# -----------------------------------------------------------
# DIGITAL ASSET PANEL
# -----------------------------------------------------------
@router.get("/digital-assets/{user_id}")
def digital_assets_panel(user_id: int, db: Session = Depends(get_db)):
    assets = db.query(DigitalAsset).filter(DigitalAsset.user_id == user_id).all()

    return {
        "user_id": user_id,
        "total_assets": len(assets),
        "assets": assets,
    }
