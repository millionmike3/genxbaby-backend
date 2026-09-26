from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from python_backend.schemas import (
    UserCreate, UserLogin, UserOut,
    DomainCreate, DomainOut,
    PropertyCreate, PropertyOut,
    BulkTapeCreate, BulkTapeOut,
    BulkTapePropertyCreate, BulkTapePropertyOut,
    MerkleAnchorRequest, MerkleAnchorOut,
    AdminStatsOut,
)

from python_backend.models import Base
from python_backend.database import get_db

from python_backend.services import (
    create_user, create_domain, create_property,
    create_bulk_tape, link_property_to_bulk_tape,
    anchor_bulk_tape, get_admin_stats,
    verify_password,
)

app = FastAPI()

@app.on_event("startup")
def startup():
    from python_backend.database import engine
    Base.metadata.create_all(bind=engine)

# AUTH
@app.post("/users", response_model=UserOut)
def api_create_user(data: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, data)

@app.post("/login")
def api_login(data: UserLogin, db: Session = Depends(get_db)):
    from python_backend.models import User
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"user_id": user.id, "role": user.role}

# DOMAIN
@app.post("/domains", response_model=DomainOut)
def api_create_domain(data: DomainCreate, db: Session = Depends(get_db)):
    return create_domain(db, data)

# PROPERTY
@app.post("/properties", response_model=PropertyOut)
def api_create_property(data: PropertyCreate, db: Session = Depends(get_db)):
    return create_property(db, data)

# BULK TAPE
@app.post("/bulk-tapes", response_model=BulkTapeOut)
def api_create_bulk_tape(data: BulkTapeCreate, db: Session = Depends(get_db)):
    return create_bulk_tape(db, data)

@app.post("/bulk-tape-properties", response_model=BulkTapePropertyOut)
def api_link_property_to_tape(data: BulkTapePropertyCreate, db: Session = Depends(get_db)):
    return link_property_to_bulk_tape(db, data)

@app.post("/bulk-tapes/anchor", response_model=MerkleAnchorOut)
def api_anchor_bulk_tape(req: MerkleAnchorRequest, db: Session = Depends(get_db)):
    try:
        return anchor_bulk_tape(db, req)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# ADMIN
@app.get("/admin/stats", response_model=AdminStatsOut)
def api_admin_stats(db: Session = Depends(get_db)):
    return AdminStatsOut(**get_admin_stats(db))
