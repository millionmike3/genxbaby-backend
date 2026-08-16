from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import csv
import io
from datetime import datetime

from database import SessionLocal
from models import BulkTape, BulkTapeProperty, Property
from schemas import BulkTapeOut, BulkTapePropertyOut
from signals import compute_property_signal_from_dict
from rbac import require_owner, require_admin


router = APIRouter(prefix="/bulk-tape", tags=["Bulk Tape Ingestion"])


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
# OWNER UPLOAD BULK TAPE
# ============================================================
@router.post("/owner/upload", response_model=BulkTapeOut)
def upload_bulk_tape(
    file: UploadFile = File(...),
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    """
    Owner uploads a CSV file containing property data.
    Each row becomes a BulkTapeProperty entry.
    Sanitization + scoring is applied automatically.
    """

    try:
        content = file.file.read().decode("utf-8")
    except:
        raise HTTPException(400, "Invalid file encoding")

    reader = csv.DictReader(io.StringIO(content))

    # Create BulkTape record
    tape = BulkTape(
        domain_id=owner.domain_id,
        admin_id=owner.id,
        filename=file.filename,
        uploaded_at=datetime.utcnow(),
    )

    db.add(tape)
    db.commit()
    db.refresh(tape)

    # Process each row
    for row in reader:
        raw = dict(row)

        # Safe numeric conversion
        def safe_int(x):
            try:
                return int(float(x))
            except:
                return None

        def safe_float(x):
            try:
                return float(x)
            except:
                return None

        sanitized = {
            "address": raw.get("address"),
            "sales_price": safe_int(raw.get("sales_price")),
            "noi": safe_int(raw.get("noi")),
            "cap_rate": safe_float(raw.get("cap_rate")),
            "dscr": safe_float(raw.get("dscr")),
            "noi_value_ratio": safe_float(raw.get("noi_value_ratio")),
            "taxes": safe_int(raw.get("taxes")),
            "insurance": safe_int(raw.get("insurance")),
            "units": safe_int(raw.get("units")),
            "property_type": raw.get("property_type"),
        }

        # Create BulkTapeProperty entry
        btp = BulkTapeProperty(
            bulk_tape_id=tape.id,
            raw_data=raw,
            sanitized_data=sanitized,
            created_at=datetime.utcnow(),
        )

        db.add(btp)
        db.commit()
        db.refresh(btp)

        # Compute property signal
        score, status, accelerated = compute_property_signal_from_dict(sanitized)

        btp.property_signal_score = score
        btp.accelerated_pass = accelerated

        db.commit()

    return tape


# ============================================================
# OWNER VIEW BULK TAPE PROPERTIES
# ============================================================
@router.get("/owner/{tape_id}", response_model=list[BulkTapePropertyOut])
def list_bulk_tape_properties(
    tape_id: int,
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    tape = db.query(BulkTape).filter(BulkTape.id == tape_id).first()
    if not tape:
        raise HTTPException(404, "Bulk tape not found")

    if tape.domain_id != owner.domain_id:
        raise HTTPException(403, "Not authorized")

    return db.query(BulkTapeProperty).filter(
        BulkTapeProperty.bulk_tape_id == tape_id
    ).all()


# ============================================================
# ADMIN GLOBAL VIEW
# ============================================================
@router.get("/admin/all", response_model=list[BulkTapeOut])
def admin_list_all_tapes(
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(BulkTape).all()


@router.get("/admin/{tape_id}", response_model=list[BulkTapePropertyOut])
def admin_list_bulk_tape_properties(
    tape_id: int,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(BulkTapeProperty).filter(
        BulkTapeProperty.bulk_tape_id == tape_id
    ).all()
