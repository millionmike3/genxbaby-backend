from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import SessionLocal
from models import User, Investor, Borrower, Domain


security = HTTPBearer()


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
# AUTH HELPERS
# ============================================================
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """
    This function expects the token to be the username for now.
    Later you can replace this with JWT or OAuth.
    """
    token = credentials.credentials

    user = db.query(User).filter(User.username == token).first()
    if not user:
        raise HTTPException(401, "Invalid authentication token")

    return user


# ============================================================
# ROLE CHECKERS
# ============================================================
def require_admin(
    user: User = Depends(get_current_user),
):
    if user.role != "ADMIN":
        raise HTTPException(403, "Admin access required")
    return user


def require_owner(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.role != "OWNER":
        raise HTTPException(403, "Owner access required")

    # Owner must have a domain
    domain = db.query(Domain).filter(Domain.id == user.domain_id).first()
    if not domain:
        raise HTTPException(403, "Owner domain not found")

    return user


def require_investor(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.role != "INVESTOR":
        raise HTTPException(403, "Investor access required")

    investor = db.query(Investor).filter(Investor.user_id == user.id).first()
    if not investor:
        raise HTTPException(403, "Investor profile not found")

    return investor


def require_borrower(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.role != "BORROWER":
        raise HTTPException(403, "Borrower access required")

    borrower = db.query(Borrower).filter(Borrower.user_id == user.id).first()
    if not borrower:
        raise HTTPException(403, "Borrower profile not found")

    return borrower
