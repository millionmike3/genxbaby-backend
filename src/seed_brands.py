from database import SessionLocal, Base, engine
from models import BrandProfile

Base.metadata.create_all(bind=engine)

def upsert_brand(session, domain, **kwargs):
    brand = session.query(BrandProfile).filter(BrandProfile.domain == domain).first()
    if not brand:
        brand = BrandProfile(domain=domain, **kwargs)
        session.add(brand)
    else:
        for k, v in kwargs.items():
            setattr(brand, k, v)
    session.commit()

def main():
    db = SessionLocal()
    try:
        upsert_brand(
            db,
            "genxbaby.com",
            bank_name="GenXBaby Bank",
            legal_name="GenXBaby Finance Network Inc.",
            logo_url="https://cdn.genxbaby.com/logo.png",
            primary_color="#1A1A1A",
            secondary_color="#FF9900",
            contact_email="support@genxbaby.com",
            contact_phone="+1-800-GENXBABY",
            address="123 Wall Street, New York, NY",
            support_hours="Mon–Fri 9am–6pm EST",
            pof_header_text="GENXBABY BANK • PROOF OF FUNDS",
            mortgage_header_text="GENXBABY BANK • MORTGAGE SUMMARY",
            check_template="genxbaby_default",
        )

        upsert_brand(
            db,
            "pyxbank.com",
            bank_name="PyxBank",
            legal_name="PyxBank Financial Group LLC",
            logo_url="https://cdn.pyxbank.com/logo.png",
            primary_color="#001F3F",
            secondary_color="#FF4136",
            contact_email="support@pyxbank.com",
            contact_phone="+1-800-PYX-BANK",
            address="456 Market Street, San Francisco, CA",
            support_hours="Mon–Sat 8am–8pm PST",
            pof_header_text="PYXBANK • PROOF OF FUNDS",
            mortgage_header_text="PYXBANK • MORTGAGE SUMMARY",
            check_template="pyxbank_modern",
        )

        upsert_brand(
            db,
            "zaxbank.com",
            bank_name="ZaxBank",
            legal_name="ZaxBank Holdings Inc.",
            logo_url="https://cdn.zaxbank.com/logo.png",
            primary_color="#111111",
            secondary_color="#00FFAA",
            contact_email="support@zaxbank.com",
            contact_phone="+1-800-ZAX-BANK",
            address="789 Innovation Way, Austin, TX",
            support_hours="24/7",
            pof_header_text="ZAXBANK • PROOF OF FUNDS",
            mortgage_header_text="ZAXBANK • MORTGAGE SUMMARY",
            check_template="zaxbank_premium",
        )
    finally:
        db.close()

if __name__ == "__main__":
    main()
