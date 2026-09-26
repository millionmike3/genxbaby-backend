from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from python_backend.database import get_db
from python_backend.models import User
from python_backend.schemas import UserCreate

router = APIRouter()

@router.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(
        username=user.username,
        email=user.email,
        password=user.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
