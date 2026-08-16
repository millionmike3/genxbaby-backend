from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from database import SessionLocal
from models import (
    MortgageApplication,
    Borrower,
    Property,
    UserVault,
    CreditReportSummary,
)
from rbac import require_owner, require_admin
from signals import compute_ultra_favorable_signal


router = APIRouter(prefix="/underwriting", tags=["Underwriting"])


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
# CORE CALCS
# ============================================================
def calc_dti(monthly_debt: float, monthly_income: float) -> float:
    if monthly_income <= 0:
        return 1.0
    return monthly_debt / monthly_income


def calc_ltv(loan_amount: float, property_value: float) -> float:
    if property_value <= 0:
        return 1.0
    return loan_amount / property_value


def calc_reserves(total_assets: float, piti: float) -> float:
    if piti <= 0:
        return 0.0
    return total_assets / piti


# ============================================================
# UNDERWRITING SUMMARY STRUCTURE
# ============================================================
def build_underwriting_summary(
    app: MortgageApplication,
    borrower: Borrower,
    prop: Property,
    vault: UserVault | None,
    credit: CreditReportSummary | None,
):
    loan_amount = app.loan_amount or 0
    property_value = prop.sales_price or 0

    # Placeholder income/debt until integrated
    monthly_income = getattr(borrower.user, "verified_income", 6000) / 12
    monthly_debt = getattr(borrower.user, "reported_monthly_debt", 500)

    dti = calc_dti(monthly_debt, monthly_income)
    ltv = calc_ltv(loan_amount, property_value)

    piti = (loan_amount * 0.06 / 12) + (prop.taxes or 0) / 12 + (prop.insurance or 0) / 12

    total_assets = 0
    if vault:
        total_assets = (
            (vault.cash_balance or 0)
            + (vault.crypto_balance or 0)
            + (vault.reo_equity or 0)
            + (vault.domain_value or 0)
        )

    reserves_months = calc_reserves(total_assets, piti)

    credit_score = credit.score if credit else None

    borrower_signal = app.borrower_signal_score
    property_signal = app.property_signal_score
    ultra = compute_ultra_favorable_signal(
        borrower_signal or 0,
        property_signal or 0,
    ) if borrower_signal is not None and property_signal is not None else False

    conditions = []

    if dti > 0.5:
        conditions.append("High DTI: consider paying down debt or increasing income.")
    if ltv > 0.85:
        conditions.append("High LTV: consider larger down payment or lower purchase price.")
    if reserves_months < 3:
        conditions.append("Low reserves: require at least 3 months PITI in reserves.")
    if credit_score and credit_score < 640:
        conditions.append("Low credit score: consider credit improvement plan.")

    risk_tier = "A"
    if dti > 0.5 or ltv > 0.9 or (credit_score and credit_score < 640):
        risk_tier = "C"
    elif dti > 0.43 or ltv > 0.85 or (credit_score and credit_score < 680):
        risk_tier = "B"

    return {
        "application_id": app.id,
        "borrower_id": borrower.id,
        "property_id": prop.id,
        "loan_amount": loan_amount,
        "property_value": property_value,
        "dti": round(dti, 3),
        "ltv": round(ltv, 3),
        "reserves_months": round(reserves_months, 2),
        "credit_score": credit_score,
        "borrower_signal_score": borrower_signal,
        "property_signal_score": property_signal,
        "ultra_favorable_signal": ultra,
        "risk_tier": risk_tier,
        "conditions": conditions,
    }


# ============================================================
# OWNER VIEW UNDERWRITING SUMMARY
# ============================================================
@router.get("/owner/{application_id}", response_model=dict)
def owner_underwriting_summary(
    application_id: int,
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    app = db.query(MortgageApplication).filter(
        MortgageApplication.id == application_id
    ).first()
    if not app:
        raise HTTPException(404, "Application not found")

    if app.domain_id != owner.domain_id:
        raise HTTPException(403, "Not authorized")

    borrower = db.query(Borrower).filter(Borrower.id == app.borrower_id).first()
    if not borrower:
        raise HTTPException(404, "Borrower not found")

    prop = db.query(Property).filter(Property.id == app.property_id).first()
    if not prop:
        raise HTTPException(404, "Property not found")

    vault = db.query(UserVault).filter(
        UserVault.user_id == borrower.user_id
    ).first()

    credit = db.query(CreditReportSummary).filter(
        CreditReportSummary.application_id == application_id
    ).order_by(CreditReportSummary.created_at.desc()).first()

    summary = build_underwriting_summary(app, borrower, prop, vault, credit)
    return summary


# ============================================================
# ADMIN VIEW UNDERWRITING SUMMARY
# ============================================================
@router.get("/admin/{application_id}", response_model=dict)
def admin_underwriting_summary(
    application_id: int,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    app = db.query(MortgageApplication).filter(
        MortgageApplication.id == application_id
    ).first()
    if not app:
        raise HTTPException(404, "Application not found")

    borrower = db.query(Borrower).filter(Borrower.id == app.borrower_id).first()
    if not borrower:
        raise HTTPException(404, "Borrower not found")

    prop = db.query(Property).filter(Property.id == app.property_id).first()
    if not prop:
        raise HTTPException(404, "Property not found")

    vault = db.query(UserVault).filter(
        UserVault.user_id == borrower.user_id
    ).first()

    credit = db.query(CreditReportSummary).filter(
        CreditReportSummary.application_id == application_id
    ).order_by(CreditReportSummary.created_at.desc()).first()

    summary = build_underwriting_summary(app, borrower, prop, vault, credit)
    return summary
