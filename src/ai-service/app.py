"""
VN-MURL SafeWeb — FastAPI AI Microservice
Machine Learning for URL Security & Child-Safe Web Access
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import PredictRequest, PredictResponse, HealthResponse, ModelInfoResponse
from model_loader import load_model, get_model_metadata
from predictor import predict_url

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("vnmurl.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm up model on startup
    logger.info("Initializing VN-MURL SafeWeb model...")
    try:
        load_model()
        logger.info("Model loaded successfully on startup.")
    except Exception as e:
        logger.error("Failed to load model on startup: %s", e)
    yield
    logger.info("Shutting down AI service.")


app = FastAPI(
    title="VN-MURL SafeWeb AI Service",
    description="Machine Learning service for URL Security & Child-Safe Web Access",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health():
    """Health check endpoint indicating model readiness."""
    try:
        bundle = load_model()
        model_loaded = bundle is not None
        feature_count = len(bundle.get("feature_columns", []))
    except Exception:
        model_loaded = False
        feature_count = 0

    return HealthResponse(
        status="healthy" if model_loaded else "unhealthy",
        model_loaded=model_loaded,
        feature_count=feature_count or 48
    )


@app.get("/model/info", response_model=ModelInfoResponse)
def model_info():
    """Returns detailed metadata about the active ML models and thresholds."""
    try:
        bundle = load_model()
        metadata = get_model_metadata()

        sec = bundle.get("security", {})
        child = bundle.get("child_safety", {})

        return ModelInfoResponse(
            artifact_type=bundle.get("artifact_type", "VN_MURL_SafeWeb_3Label_Composite_Model"),
            artifact_version=bundle.get("artifact_version", "2.0"),
            security_model=sec.get("model_name", "Random Forest"),
            adult_model=child.get("model_name", "Logistic Regression"),
            security_threshold=float(sec.get("threshold", 0.425)),
            adult_threshold=float(child.get("threshold", 0.140)),
            feature_count=len(bundle.get("feature_columns", [])),
            final_labels=bundle.get("final_labels", {
                "BENIGN": {"action": "ALLOW", "description": "URL is allowed"},
                "PHISHING": {"action": "BLOCK", "description": "Phishing URL is blocked"},
                "ADULT": {"action": "BLOCK", "description": "Adult URL is blocked"}
            }),
            feature_columns=bundle.get("feature_columns", []),
            security_metadata=metadata.get("security", {}).get("metadata"),
            child_safety_metadata=metadata.get("child_safety", {}).get("metadata"),
            research_policy=metadata.get("research_policy")
        )
    except Exception as e:
        logger.error("Error fetching model info: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    """
    Classifies an input URL into exactly one final 3-label output:
    - BENIGN -> ALLOW
    - PHISHING -> BLOCK
    - ADULT -> BLOCK
    """
    url = request.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL cannot be empty")

    try:
        result = predict_url(url)
        return PredictResponse(**result)
    except Exception as e:
        logger.error("Prediction failed for URL '%s': %s", url, e)
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
