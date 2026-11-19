"""
Tests for VN-MURL SafeWeb AI Service.
"""

import sys
from pathlib import Path
import pytest

# Add ai-service to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from feature_extractor import extract_url_features
from model_loader import load_model, get_model_metadata
from predictor import predict_url
from app import app, health, model_info, predict
from schemas import PredictRequest



def test_feature_extractor_count():
    """Verify exactly 48 lexical features are extracted."""
    features = extract_url_features("https://vnexpress.net/thoi-su")
    assert len(features) == 48
    assert "url_length" in features
    assert "url_entropy" in features
    assert "tld_length" in features
    assert "is_suspicious_tld" in features


def test_public_suffix_handling():
    """Verify tldextract correctly handles ccTLDs such as .com.vn."""
    features = extract_url_features("https://portal.danang.gov.vn/login")
    assert features["tld_length"] == len("gov.vn")
    assert features["has_https"] == 1.0


def test_model_loading():
    """Verify single joblib artifact loads composite dictionary."""
    bundle = load_model()
    assert isinstance(bundle, dict)
    assert bundle["artifact_type"] == "VN_MURL_SafeWeb_3Label_Composite_Model"
    assert "security" in bundle
    assert "child_safety" in bundle
    assert len(bundle["feature_columns"]) == 48


def test_prediction_output_format():
    """Verify predictor returns expected keys and valid labels."""
    res = predict_url("http://reerenn8.top")
    assert "url" in res
    assert res["label"] in ["BENIGN", "PHISHING", "ADULT"]
    assert res["action"] in ["ALLOW", "BLOCK"]
    assert 0.0 <= res["confidence"] <= 1.0
    assert 0.0 <= res["phishing_score"] <= 1.0
    assert 0.0 <= res["adult_score"] <= 1.0


def test_health_endpoint():
    """Test GET /health."""
    res = health()
    assert res.status == "healthy"
    assert res.model_loaded is True
    assert res.feature_count == 48


def test_model_info_endpoint():
    """Test GET /model/info."""
    res = model_info()
    assert res.security_model == "Random Forest"
    assert res.adult_model == "Logistic Regression"
    assert res.security_threshold == pytest.approx(0.425)
    assert res.adult_threshold == pytest.approx(0.14)
    assert len(res.feature_columns) == 48


def test_predict_endpoint():
    """Test POST /predict."""
    res = predict(PredictRequest(url="http://reerenn8.top"))
    assert res.label == "PHISHING"
    assert res.action == "BLOCK"
    assert res.confidence >= 0.425
