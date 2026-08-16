from sqlalchemy.orm import Session
from models import UserVault, Borrower, Property


# ============================================================
# BORROWER SIGNAL ENGINE
# ============================================================
def compute_borrower_signal(borrower_id: int, db: Session) -> int:
    """
    Borrower Favorability Score (0–100)
    Based on:
    - Income strength
    - Credit strength (if available)
    - Asset strength
    - Loan amount vs reserves
    """

    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()
    if not borrower:
        return 0

    user = borrower.user
    vault = db.query(UserVault).filter(UserVault.user_id == user.id).first()

    if not vault:
        return 0

    score = 0

    # 1. Asset Strength (0–30)
    total_assets = (
        (vault.cash_balance or 0)
        + (vault.crypto_balance or 0)
        + (vault.reo_equity or 0)
        + (vault.domain_value or 0)
    )

    if total_assets >= 250000:
        score += 30
    elif total_assets >= 100000:
        score += 20
    elif total_assets >= 50000:
        score += 10

    # 2. Liability Strength (0–20)
    liabilities = vault.total_liabilities or 0

    if liabilities == 0:
        score += 20
    elif liabilities < 25000:
        score += 10

    # 3. Credit Strength (0–30)
    credit_score = getattr(user, "credit_score", None)

    if credit_score:
        if credit_score >= 720:
            score += 30
        elif credit_score >= 680:
            score += 20
        elif credit_score >= 640:
            score += 10
    else:
        score += 10

    # 4. Income Strength (0–20)
    income = getattr(user, "verified_income", None)

    if income:
        if income >= 100000:
            score += 20
        elif income >= 60000:
            score += 10
    else:
        score += 5

    return min(score, 100)


# ============================================================
# PROPERTY SIGNAL ENGINE
# ============================================================
def compute_property_signal(property_obj: Property):
    """
    Property Favorability Score (0–100)
    """

    score = 0

    cap_rate = property_obj.cap_rate or 0
    dscr = property_obj.dscr or 0
    noi_value_ratio = property_obj.noi_value_ratio or 0
    taxes = property_obj.taxes or 0
    insurance = property_obj.insurance or 0
    noi = property_obj.noi or 0

    # 1. Cap Rate (0–20)
    if cap_rate >= 0.07:
        score += 20
    elif cap_rate >= 0.05:
        score += 15
    elif cap_rate >= 0.03:
        score += 10

    # 2. DSCR (0–20)
    if dscr >= 1.20:
        score += 20
    elif dscr >= 1.0:
        score += 10

    # 3. NOI/Value Ratio (0–20)
    if noi_value_ratio >= 0.10:
        score += 20
    elif noi_value_ratio >= 0.05:
        score += 10

    # 4. Tax/Insurance Burden (0–20)
    burden = (taxes + insurance) / noi if noi else 1

    if burden <= 0.15:
        score += 20
    elif burden <= 0.25:
        score += 10

    # 5. Property Type Fit (0–20)
    score += 20

    # Status
    if score >= 80:
        status = "PASS"
    elif score >= 60:
        status = "WATCH"
    else:
        status = "FAIL"

    # Accelerated Pass/Fail
    accelerated = (
        cap_rate >= 0.05 and
        dscr >= 1.20 and
        noi_value_ratio >= 0.10
    )

    return score, status, accelerated


# ============================================================
# WRAPPER FOR DICT-BASED SCORING
# ============================================================
def compute_property_signal_from_dict(data: dict):
    """
    Allows scoring from a raw dictionary (Bulk Tape ingestion).
    """
    temp = Property(**data)
    return compute_property_signal(temp)


# ============================================================
# ULTRA FAVORABLE SIGNAL ENGINE
# ============================================================
def compute_ultra_favorable_signal(borrower_score: int, property_score: int) -> bool:
    """
    Ultra Favorable Signal triggers when BOTH:
    - Borrower Signal >= 80
    - Property Signal >= 80
    """
    return borrower_score >= 80 and property_score >= 80
