from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import csv
import io
from datetime import datetime

from database import SessionLocal
from models import (
    Property,
    BulkTape,
    BulkTapeProperty,
    Investor,
    Domain,
)
from schemas import (
    PropertyCreate,
    PropertyOut,
    BulkTapeOut,
    BulkTapePropertyOut,
)
from signals import compute_property_signal
from rbac import require_investor, require_owner, require_admin


router = APIRouter(prefix="/property", tags=["Property Sanitizer"])


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
# ADD PROPERTY (INVESTOR)
# ============================================================
# ============================================================
# BULK TAPE UPLOAD (OWNER ONLY)
# ============================================================
@router.post("/owner/bulk-tape/upload", response_model=BulkTapeOut)
def upload_bulk_tape(
    file: UploadFile = File(...),
    owner=Depends(require_owner),
    db: Session = Depends(get_db),
):
    # Read CSV content
    content = file.file.read().decode("utf-8")
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
        score, status, accelerated = compute_property_signal(
            Property(**sanitized)
        )

        btp.property_signal_score = score
        btp.accelerated_pass = accelerated

        db.commit()

    return tape
