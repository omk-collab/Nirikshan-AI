# Nirikshan-AI Machine Learning & Risk Pipeline

## Pipeline Overview

Nirikshan-AI uses a multi-layered hybrid AI pipeline combining feature engineering, rule-based heuristics, unsupervised machine learning, NLP sentence embeddings, EXIF GIS analysis, and weighted score aggregation.

```text
Project Metrics & Photos & Official Datasets (`Allocated Limit for Honble MPs.csv` & `(1).csv`)
           │
           ▼
   Feature Engineering
 ┌─────────┴─────────┐
 ▼                   ▼
Rule-Based Risk   Isolation Forest Anomaly
 (Cost, Gap,       (Trained on Official Baseline
  Delay)            MP Allocations & Outliers)
   │                 │
   └────────┬────────┘
            ▼
   Unified Risk Engine (0-100 Score)
            │
            ▼
   Explainable Risk Dossier
```

## Component Breakdowns

### 1. Feature Engineering
* **Cost Deviation %**: `((Actual Cost - Estimated Cost) / Estimated Cost) * 100`
* **Expenditure Ratio %**: `(Expenditure / Sanctioned Amount) * 100`
* **Progress Gap %**: `Financial Progress - Physical Progress`
* **Delay Days**: Elapsed days past scheduled target completion date.

### 2. Unsupervised Isolation Forest (`scikit-learn`)
* Evaluates non-linear multi-dimensional anomaly scores (`contamination = 0.1`).
* Features normalized: `[costDeviation, expenditureRatio, financialProgress, physicalProgress, progressGap, delayDays]`.
* Output: `isAnomaly` flag, `anomalyScore`, and `anomalyConfidence`.

### 3. Geotag Verification & GIS
* **EXIF Parser**: Extracts `GPSLatitude`, `GPSLongitude`, `DateTimeOriginal`, and camera details.
* **Haversine Distance**: Calculates ground distance (meters) between project coordinates and photo EXIF location.
* **pHash Duplicate Detection**: Computes 64-bit perceptual hash (`imagehash.phash`) to flag reused photos.

### 4. Sentence Transformer Proposal Matching
* Uses `all-MiniLM-L6-v2` transformer model to produce 384-dimensional dense semantic vectors.
* Cosine similarity comparison detects duplicate or overlapping work descriptions across neighboring regions.

### 5. Unified 0–100 Risk Scoring Weights
* Financial Risk: **25%**
* Progress Risk: **25%**
* Delay Risk: **15%**
* ML Anomaly: **15%**
* Photo Risk: **10%**
* Peer Risk: **5%**
* Similarity Risk: **5%**
