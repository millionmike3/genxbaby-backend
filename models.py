from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Borrower, User, Domain

router = APIRouter(
    prefix="/borrowers",
    tags=["Borrowers"]
)

# -----------------------------------------------------------
# GET ALL BORROWERS
# -----------------------------------------------------------
@router.get("/")
def get_all_borrowers(db: Session = Depends(get_db)):
    borrowers = db.query(Borrower).all()
    return borrowers

# -----------------------------------------------------------
# GET BORROWER BY ID
# -----------------------------------------------------------
@router.get("/{borrower_id}")
def get_borrower(borrower_id: int, db: Session = Depends(get_db)):
    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")
    return borrower

# -----------------------------------------------------------
# CREATE BORROWER
# -----------------------------------------------------------
@router.post("/")
def create_borrower(user_id: int, domain_id: int, db: Session = Depends(get_db)):
    # Validate user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Validate domain exists
    domain = db.query(Domain).filter(Domain.id == domain_id).first()
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")

    # Create borrower record
    borrower = Borrower(
        user_id=user_id,
        domain_id=domain_id
    )

    db.add(borrower)
    db.commit()
    db.refresh(borrower)

    return borrower

# -----------------------------------------------------------
# UPDATE BORROWER (change domain or user)
# -----------------------------------------------------------
@router.put("/{borrower_id}")
def update_borrower(borrower_id: int, user_id: int = None, domain_id: int = None, db: Session = Depends(get_db)):
    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")

    # Update user if provided
    if user_id is not None:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        borrower.user_id = user_id

    # Update domain if provided
    if domain_id is not None:
        domain = db.query(Domain).filter(Domain.id == domain_id).first()
        if not domain:
            raise HTTPException(status_code=404, detail="Domain not found")
        borrower.domain_id = domain_id

    db.commit()
    db.refresh(borrower)

    return borrower

# -----------------------------------------------------------
# DELETE BORROWER
# -----------------------------------------------------------
@router.delete("/{borrower_id}")
def delete_borrower(borrower_id: int, db: Session = Depends(get_db)):
    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")

    db.delete(borrower)
    db.commit()

    return {"message": "Borrower deleted successfully"}
