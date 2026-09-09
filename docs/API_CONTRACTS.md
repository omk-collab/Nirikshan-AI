# Nirikshan-AI API Specifications & Contracts

## Express Backend Endpoints (`http://localhost:5000/api`)

### Authentication
* `POST /api/auth/login`: Authenticate official/analyst credentials and issue JWT.
* `GET /api/auth/me`: Retrieve current logged-in user session profile.

### Project Management
* `GET /api/projects`: Query project registry with state, district, work-type, risk level, and search filters.
* `GET /api/projects/:projectId`: Detailed profile for a single project.
* `POST /api/projects`: Register a new MPLADS work entry.
* `PUT /api/projects/:projectId`: Update project milestones or expenditure figures.

### Risk & Intelligence
* `GET /api/risk/overview`: Get risk model weights, anomaly statistics, and AI health status.
* `GET /api/risk/critical`: List projects flagged with CRITICAL risk (>80 score).
* `POST /api/risk/analyze/:projectId`: Execute AI risk pipeline and save updated risk dossier.

### Photos & Geotag Verification
* `POST /api/photos/upload`: Upload inspection photo and run EXIF + Haversine distance verification.
* `GET /api/photos/project/:projectId`: Fetch photo inspection history for a project.

---

## Python FastAPI AI Service Endpoints (`http://localhost:8000/ai`)

### System & Health
* `GET /ai/health`: Microservice readiness & model status check.

### AI Risk & Anomaly Pipelines
* `POST /ai/analyze-project`: Full 7-vector unified risk evaluation.
* `POST /ai/anomaly`: Run Isolation Forest anomaly prediction.
* `POST /ai/photo-verify`: Process multipart photo for EXIF GPS metadata & Haversine delta calculation.
* `POST /ai/similarity`: Sentence Transformer cosine similarity for proposal duplicate detection.
