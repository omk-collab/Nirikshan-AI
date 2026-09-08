# Nirikshan-AI (निरीक्षण-AI)

## AI-Powered MPLADS Monitoring & Risk Intelligence Platform

Nirikshan-AI is an intelligent monitoring and decision-support platform designed to assist Ministry administrators (MoSPI), State Planning Authorities, and District Collectorates in overseeing Member of Parliament Local Area Development Scheme (MPLADS) infrastructure works.

The platform continuously analyzes project dossiers, financial vouchers, physical execution milestones, and geotagged photographic evidence to highlight anomalies and prioritize works for supervisory review.

---

## Key Features & Visual Capabilities

- **Executive Analytics Dashboard (`/dashboard`)**: Macro KPI metrics, AI monitoring insight alerts, risk distribution donut chart, milestone status bars, monthly financial trajectory, and critical priority queue.
- **Projects Explorer (`/projects`)**: Searchable, filterable, and sortable registry of all MPLADS works with real-time physical vs financial progress comparison.
- **Project Details Dossier (`/projects/:id`)**: Deep-dive project view containing cost escalation formulas, execution timelines, 7-vector risk radar chart, explainable risk reasons, and recommended supervisory actions (e.g. Hero Demo `MPLADS-DEMO-001`).
- **AI Risk Intelligence & Isolation Forest (`/risk`)**: Transparent multi-factor weighting model and unsupervised Isolation Forest anomaly detection with Z-score feature attribution.
- **Financial & Cost Deviation Analysis (`/financial-analysis`)**: Automated tracking of actual vs estimated expenditure and cost overruns.
- **Progress Monitoring (`/progress-monitoring`)**: Identification of milestone divergence where financial disbursement exceeds verified physical construction on site.
- **Geotagged Photo Verification (`/photo-verification`)**: Split-screen photo auditor with embedded EXIF extraction, Haversine geospatial proximity verification, and perceptual image hash (pHash) duplicate detection.
- **Interactive GIS Map (`/map`)**: Leaflet mapping with color-coded risk markers and interactive project popups.
- **Administrative Alerts Center (`/alerts`)**: Severity-ranked alert triage workflow (`CRITICAL`, `HIGH`, `MEDIUM`, `RESOLVED`).
- **Similar Projects Detection (`/similar-projects`)**: Sentence Transformer cosine similarity matching to flag potentially overlapping project descriptions.
- **Natural Language AI Query Assistant (`/ai-assistant`)**: Natural language retrieval assistant for querying project risks and progress gaps.
- **User Directory & RBAC (`/users`)**: Multi-tier administrative user hierarchy across 5 governance roles.
- **Governance Audit Trail (`/audit-logs`)**: Immutable logging of administrative actions, recalculations, and verifications.

---

## Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router v6, Recharts, Leaflet, React Leaflet, Lucide React, Axios.
- **Data Architecture**: Decoupled asynchronous service layer (`frontend/src/services/`) currently operating in simulated intelligence mode with realistic synthetic demo data (`frontend/src/data/`).

---

## How to Run the Project Locally

### 1. Prerequisites
- Node.js (v18+ recommended, tested on Node v22)
- npm (v9+)

### 2. Installation & Execution
```bash
# Navigate to frontend
cd frontend

# Install dependencies (already installed)
npm install

# Start the development server
npm run dev
```

The application will be accessible at:
```
http://localhost:5173/
```

### 3. Production Build Validation
To test production bundling:
```bash
npm run build
npm run preview
```

---

## Demo Credentials

For quick role switching on `/login`:
- **Ministry Admin**: `admin@example.com` (password: any)
- **Risk Analyst**: `analyst@example.com` (password: any)
- **District Authority**: `dc.pune@example.com` (password: any)
