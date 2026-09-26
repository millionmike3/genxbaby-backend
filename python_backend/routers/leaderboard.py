from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from python_backend.database import get_db
from python_backend.models import User

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("/")
def leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.xp.desc()).all()
    return users
