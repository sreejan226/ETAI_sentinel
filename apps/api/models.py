import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, Integer, DateTime, JSON
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    description = Column(Text, nullable=False)
    phone = Column(String, nullable=True)
    upi_id = Column(String, nullable=True)
    website = Column(String, nullable=True)
    profile_link = Column(String, nullable=True)
    location = Column(String, nullable=True)
    amount = Column(Float, nullable=True)
    reporter_type = Column(String, default="citizen")
    status = Column(String, default="pending")  # pending | processing | investigated | closed
    classification = Column(JSON, nullable=True)
    threat_score = Column(Integer, nullable=True)
    risk_color = Column(String, nullable=True)
    media_paths = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    entity = Column(String, nullable=False, index=True)
    entity_type = Column(String, nullable=False)
    complaint_ids = Column(JSON, default=list)
    report = Column(JSON, nullable=True)
    threat_score = Column(Integer, nullable=True)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
