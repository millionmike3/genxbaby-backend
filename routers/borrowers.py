from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Borrower  # adjust if your model name differs
from schemas import BorrowerCreate, BorrowerResponse  # if you use Pydantic schemas

router = APIRouter(
    prefix="/borrowers",
    tags=["Borrowers"]
)

# -----------------------------
# Get all borrowers
# -----------------------------
@router.get("/", response_model=List[BorrowerResponse])
def get_all_borrowers(db: Session = Depends(get_db)):
    borrowers = db.query(Borrower).all()
    return borrowers

# -----------------------------
# Get borrower by ID
# -----------------------------
@router.get("/{borrower_id}", response_model=BorrowerResponse)
def get_borrower(borrower_id: int, db: Session = Depends(get_db)):
    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")
    return borrower

# -----------------------------
# Create borrower
# -----------------------------
@router.post("/", response_model=BorrowerResponse)
def create_borrower(payload: BorrowerCreate, db: Session = Depends(get_db)):
    new_borrower = Borrower(**payload.dict())
    db.add(new_borrower)
    db.commit()
    db.refresh(new_borrower)
    return new_borrower

# -----------------------------
# Update borrower
# -----------------------------
@router.put("/{borrower_id}", response_model=BorrowerResponse)
def update_borrower(borrower_id: int, payload: BorrowerCreate, db: Session = Depends(get_db)):
    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")

    for key, value in payload.dict().items():
        setattr(borrower, key, value)

    db.commit()
    db.refresh(borrower)
    return borrower

# -----------------------------
# Delete borrower
# -----------------------------
@router.delete("/{borrower_id}")
def delete_borrower(borrower_id: int, db: Session = Depends(get_db)):
    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")

    db.delete(borrower)
    db.commit()
    return {"message": "Borrower deleted successfully"}
