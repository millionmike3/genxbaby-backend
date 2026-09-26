from python_backend.database import Base

# Core user + auth models
from python_backend.models.user import User
from python_backend.models.brand_profile import BrandProfile
from python_backend.models.user_vault import UserVault
from python_backend.models.digital_asset import DigitalAsset

# Domain + borrower + investor
from python_backend.models.domain import Domain
from python_backend.models.borrower import Borrower
from python_backend.models.investor import Investor
from python_backend.models.owner import Owner

# Property + bulk tape
from python_backend.models.property import Property
from python_backend.models.bulk_tape import BulkTape
from python_backend.models.bulk_tape_property import BulkTapeProperty

# Mortgage + underwriting
from python_backend.models.mortgage import Mortgage
from python_backend.models.underwriting_case import UnderwritingCase

# Credit + signals
from python_backend.models.credit_report import CreditReportSummary
from python_backend.models.signal import Signal

# Loan docs
from python_backend.models.loan_estimate import LoanEstimate
from python_backend.models.closing_disclosure import ClosingDisclosure
from python_backend.models.disbursement_check import DisbursementCheck

# NEW: Mortgage Application
from python_backend.models.mortgage_application import MortgageApplication

__all__ = [
    "Base",
    "User",
    "BrandProfile",
    "UserVault",
    "DigitalAsset",
    "Domain",
    "Borrower",
    "Investor",
    "Owner",
    "Property",
    "BulkTape",
    "BulkTapeProperty",
    "Mortgage",
    "UnderwritingCase",
    "CreditReportSummary",
    "Signal",
    "LoanEstimate",
    "ClosingDisclosure",
    "DisbursementCheck",
    "MortgageApplication",
]
