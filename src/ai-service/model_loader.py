"""
VN-MURL SafeWeb — Model Loader
Loads single composite joblib artifact and metadata.
"""

import os
import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional
import joblib

logger = logging.getLogger("vnmurl.model_loader")

_MODEL_BUNDLE: Optional[Dict[str, Any]] = None
_MODEL_METADATA: Optional[Dict[str, Any]] = None


def get_model_file_paths() -> tuple[Path, Path]:
    """Finds path to model artifact and metadata json."""
    base_dir = Path(__file__).resolve().parent
    model_dir = base_dir / "model"

    env_model = os.getenv("MODEL_PATH")
    if env_model and Path(env_model).exists():
        joblib_path = Path(env_model)
    elif (model_dir / "VN_MURL_SafeWeb_Final_Model.joblib").exists():
        joblib_path = model_dir / "VN_MURL_SafeWeb_Final_Model.joblib"
    elif (base_dir.parent.parent / "VN_MURL_SafeWeb_Final_Model.joblib").exists():
        joblib_path = base_dir.parent.parent / "VN_MURL_SafeWeb_Final_Model.joblib"
    else:
        joblib_path = model_dir / "VN_MURL_SafeWeb_Final_Model.joblib"

    json_path = joblib_path.with_name("VN_MURL_SafeWeb_Final_Model_Metadata.json")
    return joblib_path, json_path


def load_model() -> Dict[str, Any]:
    """Loads the composite model artifact into memory."""
    global _MODEL_BUNDLE, _MODEL_METADATA
    if _MODEL_BUNDLE is not None:
        return _MODEL_BUNDLE

    joblib_path, json_path = get_model_file_paths()
    logger.info("Loading model artifact from %s", joblib_path)

    if not joblib_path.exists():
        raise FileNotFoundError(f"Model artifact not found at {joblib_path}")

    _MODEL_BUNDLE = joblib.load(str(joblib_path))
    logger.info("Successfully loaded model artifact. Type: %s", type(_MODEL_BUNDLE))

    if json_path.exists():
        with open(json_path, "r", encoding="utf-8") as f:
            _MODEL_METADATA = json.load(f)
    else:
        _MODEL_METADATA = {}

    return _MODEL_BUNDLE


def get_model_metadata() -> Dict[str, Any]:
    """Returns loaded model metadata."""
    global _MODEL_METADATA
    if _MODEL_METADATA is None:
        load_model()
    return _MODEL_METADATA or {}
