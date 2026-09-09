import os
import sys
import shutil

# Ensure ai-service root directory is in sys.path for IDE linter and runner module resolution
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from services.dataset_loader import OfficialDatasetLoader
from services.feature_engine import FeatureEngine
from services.rule_engine import RuleEngine
from services.anomaly_engine import anomaly_engine_instance
from services.similarity_engine import SimilarityEngine
from services.photo_engine import PhotoEngine
from services.risk_engine import RiskEngine

app = FastAPI(
    title="Nirikshan-AI Risk Intelligence Service",
    description="FastAPI AI/ML backend for MPLADS Project Risk Scoring, Isolation Forest Anomaly Detection, Geotag Photo EXIF Verification, and Proposal Similarity Analysis.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "temp_uploads")
os.makedirs(TEMP_UPLOAD_DIR, exist_ok=True)


class ProjectDataPayload(BaseModel):
    projectId: Optional[str] = "MPLADS-DEMO-001"
    description: Optional[str] = ""
    workType: Optional[str] = "Infrastructure"
    sanctionedAmount: Optional[float] = 0.0
    estimatedCost: Optional[float] = 0.0
    actualCost: Optional[float] = 0.0
    expenditure: Optional[float] = 0.0
    physicalProgress: Optional[float] = 0.0
    financialProgress: Optional[float] = 0.0
    delayDays: Optional[int] = 0
    latitude: Optional[float] = 0.0
    longitude: Optional[float] = 0.0
    photoRisk: Optional[float] = 15.0
    peerProjects: Optional[List[Dict[str, Any]]] = []
    similarCorpus: Optional[List[Dict[str, Any]]] = []


class SimilarityPayload(BaseModel):
    targetDescription: str
    corpus: List[Dict[str, Any]] = []


@app.get("/ai/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Nirikshan-AI Python FastAPI Risk Intelligence Microservice",
        "version": "1.0.0",
        "officialDatasetStats": OfficialDatasetLoader.get_summary_statistics(),
        "isolationForestReady": anomaly_engine_instance.model is not None
    }


@app.get("/ai/dataset-stats")
def dataset_stats():
    """Returns aggregated statistics from the official MoSPI MPLADS CSV datasets."""
    return {
        "success": True,
        "data": OfficialDatasetLoader.get_summary_statistics()
    }


@app.get("/ai/official-allocations")
def official_allocations(limit: int = 100):
    """Returns official MP financial allocation records parsed from Rajya Sabha and Lok Sabha CSV datasets."""
    records = OfficialDatasetLoader.load_mp_allocations()
    return {
        "success": True,
        "count": len(records),
        "data": records[:limit]
    }


@app.post("/ai/analyze-project")
def analyze_project(payload: ProjectDataPayload):
    """Unified Risk & Anomaly Analysis Endpoint (Section 45)."""
    project_dict = payload.model_dump()
    result = RiskEngine.evaluate_project_risk(
        project_dict,
        peer_projects=payload.peerProjects,
        similar_corpus=payload.similarCorpus
    )
    return {"success": True, "data": result}


@app.post("/ai/financial-analysis")
def financial_analysis(payload: ProjectDataPayload):
    features = FeatureEngine.calculate_features(payload.model_dump())
    rule_res = RuleEngine.evaluate_rules(features)
    return {
        "success": True,
        "features": features,
        "financialRisk": rule_res["financialRisk"],
        "costDeviation": features["costDeviation"],
        "expenditureRatio": features["expenditureRatio"]
    }


@app.post("/ai/progress-analysis")
def progress_analysis(payload: ProjectDataPayload):
    features = FeatureEngine.calculate_features(payload.model_dump())
    rule_res = RuleEngine.evaluate_rules(features)
    return {
        "success": True,
        "features": features,
        "progressRisk": rule_res["progressRisk"],
        "progressGap": features["progressGap"]
    }


@app.post("/ai/delay-analysis")
def delay_analysis(payload: ProjectDataPayload):
    features = FeatureEngine.calculate_features(payload.model_dump())
    rule_res = RuleEngine.evaluate_rules(features)
    return {
        "success": True,
        "delayDays": features["delayDays"],
        "delayRisk": rule_res["delayRisk"]
    }


@app.post("/ai/anomaly")
def anomaly_detection(payload: ProjectDataPayload):
    features = FeatureEngine.calculate_features(payload.model_dump())
    anomaly_res = anomaly_engine_instance.predict_anomaly(features)
    return {"success": True, "data": anomaly_res}


@app.post("/ai/similarity")
def proposal_similarity(payload: SimilarityPayload):
    matches = SimilarityEngine.compare_descriptions(payload.targetDescription, payload.corpus)
    return {"success": True, "matches": matches}


@app.post("/ai/photo-verify")
async def photo_verify(
    projectLat: float = Form(...),
    projectLng: float = Form(...),
    maxDistanceMeters: float = Form(500.0),
    file: UploadFile = File(...)
):
    """Geotagged Photo Verification Endpoint (Section 24-28)."""
    temp_path = os.path.join(TEMP_UPLOAD_DIR, file.filename)
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = PhotoEngine.verify_photo(projectLat, projectLng, temp_path, maxDistanceMeters)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass


@app.post("/ai/risk-score")
def risk_score(payload: ProjectDataPayload):
    result = RiskEngine.evaluate_project_risk(payload.model_dump())
    return {
        "success": True,
        "overallRisk": result["overallRisk"],
        "riskLevel": result["riskLevel"],
        "indicators": result["indicators"],
        "reasons": result["reasons"],
        "recommendations": result["recommendations"]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
