from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from database import SessionLocal
from models import Borrower, MortgageApplication, CreditReportSummary
from schemas import CreditReportSummaryOut
from rbac import require_admin, require_owner, require_borrower
from signals import compute_borrower_signal


router = APIRouter(prefix="/credit", tags=["Credit Bureau"])


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
# MOCK CREDIT BUREAU PULL (Replace with real API later)
# ============================================================
def mock_credit_pull(ssn: str):
    """
    Placeholder for real Experian/Equifax/TransUnion integration.
    Replace with API calls later.
    """

    # Fake deterministic scoring based on last digit
    last_digit = int(ssn[-1]) if ssn and ssn[-1].isdigit() else 5

    base_score = 600 + (last_digit * 10)
    utilization = round(0.1 * last_digit, 2)
    derogatories = max(0, 5 - last_digit)
    tradelines = 3 + last_digit

    return {
        "score": base_score,
        "utilization": utilization,
        "derogatories": derogatories,
        "tradeline_count": tradelines,
    }


# ============================================================
# BORROWER REQUESTS CREDIT PULL
# ============================================================
@router.post("/borrower/pull/{application_id}", response_model=CreditReportSummaryOut)
def borrower_pull_credit(
    application_id: int,
    borrower=Depends(require_borrower),
    db: Session = Depends(get_db),
):
    app = db.query(MortgageApplication).filter(
        MortgageApplication.id == application_id
    ).first()

    if not app:
        raise HTTPException(404, "Application not found")

    if app.borrower_id != borrower.id:
        raise HTTPException(403, "Not authorized")

    # Mock SSN for now
    ssn = "123-45-6789"

    data = mock_credit_pull(ssn)

    report = CreditReportSummary(
        borrower_id=borrower.id,
        application_id=application_id,
        score=data["score"],
        utilization=data["utilization"],
        derogatories=data["derogatories"],
        tradeline_count=data["tradeline_count"],
        credit_signal_score=data["score"],  # placeholder
        created_at=datetime.utcnow(),
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    # Update borrower signal
    borrower_signal = compute_borrower_signal(borrower.id, db)
    app.borrower_signal_score = borrower_signal
    db.commit()

    return report


# ============================================================
# OWNER PULLS CREDIT FOR BORROWER IN THEIR DOMAIN
# ============================================================
@router.post("/owner/pull/{borrower_id}/{application_id}", response_model=CreditReportSummaryOut)
def owner_pull_credit(
    borrower_id: int,
    application_id: int,
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()
    if not borrower:
        raise HTTPException(404, "Borrower not found")

    if borrower.domain_id != owner.domain_id:
        raise HTTPException(403, "Borrower not in your domain")

    app = db.query(MortgageApplication).filter(
        MortgageApplication.id == application_id
    ).first()

    if not app:
        raise HTTPException(404, "Application not found")

    if app.domain_id != owner.domain_id:
        raise HTTPException(403, "Application not in your domain")

    # Mock SSN for now
    ssn = "987-65-4321"

    data = mock_credit_pull(ssn)

    report = CreditReportSummary(
        borrower_id=borrower_id,
        application_id=application_id,
        score=data["score"],
        utilization=data["utilization"],
        derogatories=data["derogatories"],
        tradeline_count=data["tradeline_count"],
        credit_signal_score=data["score"],
        created_at=datetime.utcnow(),
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    # Update borrower signal
    borrower_signal = compute_borrower_signal(borrower_id, db)
    app.borrower_signal_score = borrower_signal
    db.commit()

    return report


# ============================================================
# ADMIN PULLS CREDIT FOR ANY BORROWER
# ============================================================
@router.post("/admin/pull/{borrower_id}/{application_id}", response_model=CreditReportSummaryOut)
def admin_pull_credit(
    borrower_id: int,
    application_id: int,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()
    if not borrower:
        raise HTTPException(404, "Borrower not found")

    app = db.query(MortgageApplication).filter(
        MortgageApplication.id == application_id
    ).first()

    if not app:
        raise HTTPException(404, "Application not found")

    # Mock SSN for now
    ssn = "555-55-5555"

    data = mock_credit_pull(ssn)

    report = CreditReportSummary(
        borrower_id=borrower_id,
        application_id=application_id,
        score=data["score"],
        utilization=data["utilization"],
        derogatories=data["derogatories"],
        tradeline_count=data["tradeline_count"],
        credit_signal_score=data["score"],
        created_at=datetime.utcnow(),
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    # Update borrower signal
    borrower_signal = compute_borrower_signal(borrower_id, db)
    app.borrower_signal_score = borrower_signal
    db.commit()

    return report


# ============================================================
# VIEW CREDIT REPORTS FOR AN APPLICATION
# ============================================================
@router.get("/reports/{application_id}", response_model=list[CreditReportSummaryOut])
def list_credit_reports(
    application_id: int,
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    """
    Owners can view credit reports for applications in their domain.
    """

    app = db.query(MortgageApplication).filter(
        MortgageApplication.id == application_id
    ).first()

    if not app:
        raise HTTPException(404, "Application not found")

    if app.domain_id != owner.domain_id:
        raise HTTPException(403, "Not authorized")

    reports = db.query(CreditReportSummary).filter(
        CreditReportSummary.application_id == application_id
    ).all()

    return reports
