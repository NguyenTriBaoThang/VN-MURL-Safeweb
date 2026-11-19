"""
Pydantic schemas for VN-MURL SafeWeb AI Service.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    url: str = Field(..., description="The URL to classify", min_length=1, max_length=2048)


class XaiFactor(BaseModel):
    title: str
    type: str
    severity: str
    evidence: str
    description: str


class XaiFeature(BaseModel):
    name: str
    key: str
    value: Any
    benchmark: str
    status: str
    explanation: str


class XaiExplanation(BaseModel):
    verdict: str
    summary: str
    factors: List[XaiFactor] = []
    features: List[XaiFeature] = []
    recommendations: List[str] = []


class PredictResponse(BaseModel):
    url: str
    label: str = Field(..., description="Final classification label: BENIGN | PHISHING | ADULT")
    action: str = Field(..., description="Final action: ALLOW | BLOCK")
    confidence: float = Field(..., description="Confidence score of final decision")
    reason: str = Field(..., description="Human-readable decision rationale")
    phishing_score: float = Field(..., description="Raw phishing probability score [0.0, 1.0]")
    adult_score: float = Field(..., description="Raw adult probability score [0.0, 1.0]")
    phishing_threshold: float = Field(..., description="Operational phishing detection threshold")
    adult_threshold: float = Field(..., description="Operational adult detection threshold")
    secondary_risk: Optional[str] = Field(None, description="Secondary detected risk if both triggered")
    xai: Optional[XaiExplanation] = Field(None, description="Explainable AI breakdown and decision factors")


class HealthResponse(BaseModel):
    status: str = "healthy"
    model_loaded: bool
    feature_count: int = 48


class ModelInfoResponse(BaseModel):
    artifact_type: str
    artifact_version: str
    security_model: str
    adult_model: str
    security_threshold: float
    adult_threshold: float
    feature_count: int
    final_labels: Dict[str, Any]
    feature_columns: List[str]
    security_metadata: Optional[Dict[str, Any]] = None
    child_safety_metadata: Optional[Dict[str, Any]] = None
    research_policy: Optional[Dict[str, Any]] = None
