# jobs/daily_matrix_job.py
from datetime import date
from .services.pricing_service import PricingService

def run_daily_matrix_job(pricing_service: PricingService):
    today = date.today()
    pricing_service.compute_daily_matrix(today)
    # Optionally: emit event "MATRIX_PUBLISHED"
