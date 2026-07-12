from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class ScamCategory(str, Enum):
    UPI_FRAUD = "upi_fraud"
    PHISHING = "phishing"
    LOAN_SCAM = "loan_scam"
    JOB_SCAM = "job_scam"
    INVESTMENT_SCAM = "investment_scam"
    ROMANCE_SCAM = "romance_scam"
    DEEPFAKE = "deepfake"
    IMPERSONATION = "impersonation"
    OTHER = "other"


class ThreatLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RiskColor(str, Enum):
    GREEN = "green"
    YELLOW = "yellow"
    ORANGE = "orange"
    RED = "red"


class ExtractedEntities(BaseModel):
    phone_numbers: list[str] = Field(default_factory=list)
    upi_ids: list[str] = Field(default_factory=list)
    emails: list[str] = Field(default_factory=list)
    urls: list[str] = Field(default_factory=list)
    telegram_handles: list[str] = Field(default_factory=list)
    whatsapp_numbers: list[str] = Field(default_factory=list)
    wallets: list[str] = Field(default_factory=list)
    locations: list[str] = Field(default_factory=list)


class ClassificationResult(BaseModel):
    scam_type: ScamCategory
    risk: ThreatLevel
    entities: ExtractedEntities
    summary: str
    priority: int = Field(ge=1, le=5)
    confidence: float = Field(ge=0.0, le=1.0)
    victim_intent: Optional[str] = None
    recommended_action: Optional[str] = None
    amount: Optional[float] = None


class ComplaintCreate(BaseModel):
    description: str
    phone: Optional[str] = None
    upi_id: Optional[str] = None
    website: Optional[str] = None
    profile_link: Optional[str] = None
    location: Optional[str] = None
    amount: Optional[float] = None
    reporter_type: str = "citizen"  # citizen | police | bank


class ComplaintResponse(BaseModel):
    id: str
    description: str
    status: str
    classification: Optional[ClassificationResult] = None
    threat_score: Optional[int] = None
    risk_color: Optional[RiskColor] = None
    created_at: datetime
    location: Optional[str] = None
    amount: Optional[float] = None


class OSINTResult(BaseModel):
    entity: str
    entity_type: str
    website_age_days: Optional[int] = None
    registrar: Optional[str] = None
    is_phishing: bool = False
    country: Optional[str] = None
    hosting: Optional[str] = None
    social_mentions: int = 0
    leaked: bool = False
    raw_findings: dict = Field(default_factory=dict)


class InvestigationReport(BaseModel):
    entity: str
    entity_type: str
    summary: str
    threat_score: int = Field(ge=0, le=100)
    risk_color: RiskColor
    aliases: list[str] = Field(default_factory=list)
    connected_complaints: list[str] = Field(default_factory=list)
    osint_findings: list[OSINTResult] = Field(default_factory=list)
    suggested_actions: list[str] = Field(default_factory=list)
    missing_information: list[str] = Field(default_factory=list)
    evidence: list[str] = Field(default_factory=list)
    timeline: list[dict] = Field(default_factory=list)


class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    properties: dict = Field(default_factory=dict)
    threat_score: Optional[int] = None


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    properties: dict = Field(default_factory=dict)


class GraphData(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]


class GeoHotspot(BaseModel):
    lat: float
    lng: float
    intensity: float
    complaint_count: int
    district: Optional[str] = None
    risk_level: RiskColor


class DashboardStats(BaseModel):
    today_complaints: int
    high_risk_accounts: int
    active_investigations: int
    deepfake_cases: int
    new_upi_ids: int
    avg_threat_score: float
    highest_risk_district: Optional[str] = None
    emerging_scam: Optional[str] = None
    trending_upi: Optional[str] = None
    top_scam_category: Optional[str] = None
