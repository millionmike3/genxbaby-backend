import requests

API_URL = "https://genxbaby-production.up.railway.app/brand-profiles"

domains = [
    "1888bank.com", "1888bank.online",
    "aukbank.com", "aukbank.online",
    "banknewloan.com", "banknewloan.online",
    "brolicbank.com", "brolicbank.online",
    "brolickbank.com", "brolickbank.online",
    "dopbank.com", "dopbank.online",
    "eodbank.com", "eodbank.online",
    "ezaibank.com", "ezaibank.online",
    "fyabank.com", "fyabank.online",
    "latencybank.com", "latencybank.online",
    "pelfbank.com", "pelfbank.online",
    "pyxbank.com", "pyxbank.online",
    "zaxbank.com", "zaxbank.online"
]

def generate_brand_payload(domain):
    name = domain.split(".")[0].capitalize()

    return {
        "domain": domain,
        "bank_name": f"{name} Bank",
        "legal_name": f"{name} Financial Group LLC",
        "logo_url": f"https://cdn.{domain}/logo.png",
        "primary_color": "#111827",
        "secondary_color": "#F97316",
        "contact_email": f"support@{domain}",
        "contact_phone": "+1 (800) 000-0000",
        "address": "123 Wall Street, New York, NY",
        "support_hours": "Mon–Fri 9am–6pm EST",
        "pof_header_text": f"{name.upper()} BANK • PROOF OF FUNDS",
        "mortgage_header_text": f"{name.upper()} BANK • MORTGAGE DISCLOSURE",
        "check_template": "default"
    }

for domain in domains:
    payload = generate_brand_payload(domain)
    r = requests.post(API_URL, json=payload)
    print(domain, r.status_code, r.text)
