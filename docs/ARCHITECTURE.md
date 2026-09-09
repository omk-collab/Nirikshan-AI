# Nirikshan-AI System Architecture

## Architecture Overview

Nirikshan-AI is built on a simplified 3-tier modular architecture designed for high scalability, developer clarity, and hackathon execution efficiency:

```text
               Nirikshan-AI Platform
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 React Frontend   Express Backend   Python AI/ML
  (Port 3000)      (Port 5000)     (Port 8000)
        │                │                │
        │                ▼                │
        │             MongoDB             │
        │           (Port 27017)          │
        └────────────── REST API ─────────┘
```

## Layer Specifications

### 1. Frontend Layer (`/frontend`)
* **Framework**: React 18 + Vite
* **Styling & UI**: Tailwind CSS, Lucide React icons
* **Data Visualization**: Recharts (Pie/Bar/Area/Radar charts), Leaflet + React-Leaflet GIS maps
* **Service Layer**: Decoupled mock/API service abstraction (`USE_MOCK_DATA` flag in `src/services/api.js`)

### 2. Backend Layer (`/backend`)
* **Runtime**: Node.js 20 ES Modules + Express
* **Database**: MongoDB 7 + Mongoose ODM (with automatic in-memory fallback for local dev)
* **Security & Auth**: JWT authentication, bcrypt password hashing, Helmet headers, CORS, express-rate-limit
* **File Uploads**: Multer handling multipart geotag photo uploads

### 3. AI / ML Microservice (`/ai-service`)
* **Framework**: Python 3.10 + FastAPI + Uvicorn
* **Feature Engineering**: Derived cost deviation, expenditure ratio, progress gap, and delay days vectors
* **Anomaly Detection**: scikit-learn `IsolationForest`
* **Geotag Verification**: Pillow EXIF GPS extractor + Haversine distance algorithm + `imagehash` perceptual hashing (pHash)
* **Text Similarity**: Sentence Transformers (`all-MiniLM-L6-v2`) & word-vector cosine similarity
* **Unified Risk Engine**: Configurable 7-vector weighted scoring aggregator (0–100)
