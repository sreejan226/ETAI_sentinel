import re
from typing import Optional


PHONE_PATTERN = re.compile(r"(?:\+91[\s-]?)?[6-9]\d{9}")
UPI_PATTERN = re.compile(r"[\w.\-]+@[\w]+")
EMAIL_PATTERN = re.compile(r"[\w.\-]+@[\w.\-]+\.\w+")
URL_PATTERN = re.compile(r"https?://[\w\.\-/]+|www\.[\w\.\-/]+")
TELEGRAM_PATTERN = re.compile(r"(?:t\.me/|@)([\w]+)", re.I)
AMOUNT_PATTERN = re.compile(r"(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)", re.I)


def extract_phones(text: str) -> list[str]:
    return list(set(PHONE_PATTERN.findall(text)))


def extract_upi_ids(text: str) -> list[str]:
    return list(set(UPI_PATTERN.findall(text)))


def extract_emails(text: str) -> list[str]:
    return list(set(EMAIL_PATTERN.findall(text)))


def extract_urls(text: str) -> list[str]:
    return list(set(URL_PATTERN.findall(text)))


def extract_telegram(text: str) -> list[str]:
    return list(set(TELEGRAM_PATTERN.findall(text)))


def extract_amount(text: str) -> Optional[float]:
    match = AMOUNT_PATTERN.search(text)
    if match:
        return float(match.group(1).replace(",", ""))
    return None


def normalize_phone(phone: str) -> str:
    digits = re.sub(r"\D", "", phone)
    if len(digits) == 10:
        return f"+91{digits}"
    if digits.startswith("91") and len(digits) == 12:
        return f"+{digits}"
    return phone


def normalize_upi(upi: str) -> str:
    return upi.strip().lower()
