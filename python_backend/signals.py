from sqlalchemy.orm import Session
from datetime import datetime
from passlib.context import CryptContext

from python_backend.models import (
    User, Domain, Property, BulkTape, BulkTapeProperty, UserVault
)

from python_backend.schemas import (
    UserCreate, DomainCreate, PropertyCreate,
    BulkTapeCreate, BulkTapePropertyCreate,
    MerkleAnchorRequest, MerkleAnchorOut
)

from python_backend.merkle import build_merkle_root_for_properties
from python_backend.blockchain import anchor_merkle_root_on_polygon

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def create_user(db: Session, data: UserCreate) -> User:
    user = User(
        username=data.username,
        email=data.email,
        phone=data.phone,
        password_hash=hash_password(data.password),
        role=data.role,
        domain_id=data.domain_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_domain(db: Session, data: DomainCreate) -> Domain:
    domain = Domain(
        name=data.name,
        brand=data.brand,
        owner_user_id=data.owner_user_id,
    )
    db.add(domain)
    db.commit()
    db.refresh(domain)
    return domain


def create_property(db: Session, data: PropertyCreate) -> Property:
    prop = Property(
        address=data.address,
        price=data.price,
        domain_id=data.domain_id,
    )
    db.add(prop)
    db.commit()
    db.refresh(prop)
    return prop


def create_bulk_tape(db: Session, data: BulkTapeCreate) -> BulkTape:
    tape = BulkTape(
        domain_id=data.domain_id,
        file_url=data.file_url,
    )
    db.add(tape)
    db.commit()
    db.refresh(tape)
    return tape


def link_property_to_bulk_tape(db: Session, data: BulkTapePropertyCreate) -> BulkTapeProperty:
    link = BulkTapeProperty(
        bulk_tape_id=data.bulk_tape_id,
        address=data.address,
        price=data.price,
        domain_id=data.domain_id,
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


def anchor_bulk_tape(db: Session, req: MerkleAnchorRequest) -> MerkleAnchorOut:
    tape = db.query(BulkTape).filter(BulkTape.id == req.tape_id).first()
    if not tape:
        raise ValueError("Bulk tape not found")

    links = db.query(BulkTapeProperty).filter(
        BulkTapeProperty.bulk_tape_id == tape.id
    ).all()

    property_ids = [link.id for link in links]

    merkle_root = build_merkle_root_for_properties(property_ids)
    tx_hash = anchor_merkle_root_on_polygon(merkle_root)

    tape.merkle_root = merkle_root
    tape.anchor_tx_hash = tx_hash
    tape.anchored_at = datetime.utcnow()
    db.commit()
    db.refresh(tape)

    return MerkleAnchorOut(
        tape_id=tape.id,
        anchor=req.anchor,
        merkle_root=merkle_root,
        created_at=tape.anchored_at,
    )


def get_admin_stats(db: Session):
    return {
        "total_users": db.query(User).count(),
        "total_domains": db.query(Domain).count(),
        "total_properties": db.query(Property).count(),
        "total_bulk_tapes": db.query(BulkTape).count(),
    }
