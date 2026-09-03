from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from schemas import (
    UserCreate, UserLogin, UserOut,
    DomainCreate, DomainOut,
    PropertyCreate, PropertyOut,
    BulkTapeCreate, BulkTapeOut,
    BulkTapePropertyCreate, BulkTapePropertyOut,
    MerkleAnchorRequest, MerkleAnchorOut,
    AdminStatsOut,
)
from models import Base
from services import (
    create_user, create_domain, create_property,
    create_bulk_tape, link_property_to_bulk_tape,
    anchor_bulk_tape, get_admin_stats,
    verify_password,
)
from database import get_db  # you define engine/session in database.py

app = FastAPI()


@app.on_event("startup")
def startup():
    from database import engine
    Base.metadata.create_all(bind=engine)


# =========================
# AUTH / USER
# =========================
@app.post("/users", response_model=UserOut)
def api_create_user(data: UserCreate, db: Session = Depends(get_db)):
    user = create_user(db, data)
    return user


@app.post("/login")
def api_login(data: UserLogin, db: Session = Depends(get_db)):
    from models import User
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"user_id": user.id, "role": user.role}


# =========================
# DOMAIN
# =========================
@app.post("/domains", response_model=DomainOut)
def api_create_domain(data: DomainCreate, db: Session = Depends(get_db)):
    domain = create_domain(db, data)
    return domain


# =========================
# PROPERTY
# =========================
@app.post("/properties", response_model=PropertyOut)
def api_create_property(data: PropertyCreate, db: Session = Depends(get_db)):
    prop = create_property(db, data)
    return prop


# =========================
# BULK TAPE
# =========================
@app.post("/bulk-tapes", response_model=BulkTapeOut)
def api_create_bulk_tape(data: BulkTapeCreate, db: Session = Depends(get_db)):
    tape = create_bulk_tape(db, data)
    return tape


@app.post("/bulk-tape-properties", response_model=BulkTapePropertyOut)
def api_link_property_to_tape(
    data: BulkTapePropertyCreate, db: Session = Depends(get_db)
):
    link = link_property_to_bulk_tape(db, data)
    return link


@app.post("/bulk-tapes/anchor", response_model=MerkleAnchorOut)
def api_anchor_bulk_tape(
    req: MerkleAnchorRequest, db: Session = Depends(get_db)
):
    try:
        result = anchor_bulk_tape(db, req)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return result


# =========================
# ADMIN DASHBOARD JSON API
# =========================
@app.get("/admin/stats", response_model=AdminStatsOut)
def api_admin_stats(db: Session = Depends(get_db)):
    stats = get_admin_stats(db)
    return AdminStatsOut(**stats)
