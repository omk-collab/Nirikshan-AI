# Nirikshan-AI

## AI-Powered MPLADS Monitoring & Risk Intelligence Platform

**Project Name:** Nirikshan-AI
**Project Type:** Smart Governance / AI / Data Analytics
**Primary Use Case:** MPLADS Project Monitoring
**Team Size:** 3 Developers
**Development Approach:** Frontend + Backend + AI/ML in separate folders
**Master Specification:** This file

---

# 1. PURPOSE OF THIS DOCUMENT

This file is the **single source of truth** for the Nirikshan-AI project.

Any AI coding agent, including Antigravity, must read this file before implementing or modifying the project.

The system should be built in a **simple, modular and hackathon-friendly way**.

Do NOT over-engineer the system.

The priority is:

```text
Working Product
↓
Good Frontend
↓
Real Backend Integration
↓
Useful AI/ML
↓
Geotagged Photo Verification
↓
Polishing
```

---

# 2. PROJECT OBJECTIVE

Nirikshan-AI is a monitoring and decision-support platform for MPLADS projects.

It analyzes project information to identify:

* financial anomalies
* cost deviations
* expenditure irregularities
* project delays
* financial vs physical progress mismatch
* unusual project patterns
* similar projects
* geotagged photo inconsistencies
* overall project risk

The system provides:

* dashboards
* project monitoring
* AI/ML risk analysis
* alerts
* maps
* photo verification
* recommendations
* explainable risk indicators

## IMPORTANT

The platform must NOT automatically declare a project or person fraudulent.

Use:

* Risk Indicator
* Potential Anomaly
* Requires Review
* Potentially Similar Work
* Photo Inconsistency

instead of declaring fraud as fact.

Human authorities make the final decision.

---

# 3. SIMPLIFIED ARCHITECTURE

Use only three major application layers:

```text
                Nirikshan-AI
                     |
        ┌────────────┼────────────┐
        ↓            ↓            ↓
   Frontend      Backend       AI/ML
    React       Node.js       FastAPI
        │            │            │
        │            ↓            │
        │         MongoDB          │
        │                           │
        └────────── API ────────────┘
```

Detailed flow:

```text
React Frontend
      ↓
Node.js / Express
      ↓
MongoDB

Node.js
      ↓
FastAPI AI Service
      ↓
ML Models
      ↓
Risk Result
      ↓
Node.js
      ↓
React
```

Do not create unnecessary additional microservices.

---

# 4. TECHNOLOGY STACK

## Frontend

Use:

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* Recharts
* Leaflet
* React Leaflet
* Lucide React

## Backend

Use:

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* Axios
* Helmet
* CORS
* express-rate-limit

## AI/ML

Use:

* Python
* FastAPI
* Pandas
* NumPy
* scikit-learn
* Sentence Transformers
* cosine similarity
* Pillow
* imagehash

Optional advanced tools can be added later.

Do NOT make YOLO or advanced computer vision mandatory for V1.

---

# 5. REPOSITORY STRUCTURE

```text
Nirikshan-AI/
│
├── frontend/
├── backend/
├── ai-service/
├── database/
├── docs/
├── tests/
├── scripts/
│
├── implementation.md
├── README.md
├── .env.example
├── .gitignore
└── docker-compose.yml
```

---

# 6. TEAM OWNERSHIP

## Developer 1 — Backend

Own:

```text
backend/
```

Responsible for:

* Express
* MongoDB
* APIs
* authentication
* authorization
* project management
* alerts
* photo APIs
* AI-service communication
* audit logs

---

## Developer 2 — Frontend

Own:

```text
frontend/
```

Responsible for:

* React
* dashboard
* pages
* charts
* tables
* map
* project details
* risk visualization
* photo verification UI
* alerts
* responsive design

---

## Developer 3 — AI/ML

Own:

```text
ai-service/
```

Responsible for:

* preprocessing
* feature engineering
* financial analysis
* progress analysis
* delay detection
* Isolation Forest
* peer comparison
* text similarity
* geotag analysis
* unified risk score

---

# 7. DEVELOPMENT PRINCIPLE

Build the system in two layers:

## Layer A — Visual / Demo Layer

The frontend must be complete enough to demonstrate the full product even before the backend is finished.

Use realistic **synthetic/demo data**.

The dashboard should never look empty.

## Layer B — Real Data Layer

Later replace:

```text
mockData
```

with:

```text
API calls
```

without changing the UI structure.

---

# 8. CRITICAL FRONTEND REQUIREMENT

## BUILD THE FULL FRONTEND FIRST

This is extremely important.

Antigravity must create a visually complete frontend during the initial implementation.

The frontend should contain all major pages even if some data initially comes from mock/demo JSON.

Do NOT create empty placeholder pages.

Do NOT create:

```text
Coming Soon
Under Construction
TODO
```

for major screens.

Every major page must have realistic content.

The frontend must be ready for screenshots.

---

# 9. FRONTEND DESIGN

Nirikshan-AI should look like a modern government analytics platform.

Design characteristics:

* professional
* clean
* modern
* data-focused
* responsive
* dashboard-oriented
* consistent
* minimal but attractive

Use:

* left sidebar
* top navigation
* page titles
* KPI cards
* charts
* tables
* badges
* filters
* tabs
* modals
* drawers where useful

Use a consistent visual language throughout the application.

---

# 10. FRONTEND COLOR / RISK SYSTEM

Use risk levels consistently:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Use appropriate visual indicators for risk levels.

Do not use excessive gradients.

Avoid excessive animations.

---

# 11. FRONTEND PAGES

Create all of the following:

```text
/login
/dashboard
/projects
/projects/:id
/risk
/financial-analysis
/progress-monitoring
/photo-verification
/map
/alerts
/similar-projects
/ai-assistant
/users
/audit-logs
```

---

# 12. LOGIN PAGE

Create a polished login page.

Show:

* Nirikshan-AI logo/name
* subtitle
* email field
* password field
* remember option
* login button
* validation
* error state

For development, support demo credentials.

Example:

```text
admin@example.com
analyst@example.com
```

The login should feel like a real enterprise application.

---

# 13. MAIN DASHBOARD

Route:

```text
/dashboard
```

This is the most important screenshot page.

Display:

## KPI Cards

```text
Total Projects
Total Sanctioned Amount
Total Expenditure
Completed Projects
Delayed Projects
High Risk Projects
Critical Projects
Average Risk Score
```

## Charts

Create:

### Risk Distribution

```text
Low
Medium
High
Critical
```

### Project Status

```text
Completed
In Progress
Delayed
Pending
```

### Financial vs Physical Progress

Show comparison.

### Expenditure Trend

Show project expenditure over time.

### State-wise Projects

Bar chart.

### Risk Trend

Line chart.

---

# 14. DASHBOARD QUICK INSIGHTS

Create a section:

```text
AI Monitoring Insights
```

Examples:

```text
12 projects require immediate review.

7 projects have significant financial/physical progress gaps.

5 projects show unusual cost deviation.

9 projects are currently delayed.

3 projects have potentially similar work descriptions.
```

Use demo data initially.

---

# 15. PROJECT EXPLORER

Route:

```text
/projects
```

Create a professional project table.

Columns:

```text
Project ID
Project Description
State
District
Work Type
Sanctioned Amount
Expenditure
Physical Progress
Financial Progress
Risk Score
Risk Level
Status
```

Features:

* search
* filter
* sorting
* pagination
* risk filter
* state filter
* district filter
* work-type filter
* status filter

Clicking a project opens Project Details.

---

# 16. PROJECT DETAILS

Route:

```text
/projects/:id
```

Create a highly detailed project monitoring page.

## Header

Display:

```text
Project ID
Project Name
Risk Score
Risk Level
Current Status
```

## Project Information

Show:

* state
* district
* constituency
* MP
* work type
* agency
* contractor

## Financial Section

Show:

```text
Sanctioned Amount
Estimated Cost
Actual Cost
Expenditure
Remaining Amount
Cost Deviation
```

Use charts/progress bars.

## Progress Section

Show:

```text
Physical Progress
Financial Progress
Progress Gap
```

Example:

```text
Financial Progress: 89%
Physical Progress: 48%

Progress Gap: 41%
```

## Timeline

Show:

```text
Start Date
Expected Completion
Current Status
Delay Days
```

---

# 17. PROJECT RISK SECTION

Display:

```text
Overall Risk Score
Financial Risk
Progress Risk
Delay Risk
ML Anomaly Risk
Photo Risk
Peer Risk
```

Use:

* progress rings
* bars
* badges
* small charts

---

# 18. RISK EXPLANATION

Create:

```text
Why is this project high risk?
```

Example:

```text
Financial progress is significantly higher than physical progress.

Actual cost is higher than estimated cost.

The project is delayed beyond its expected completion date.

The project differs from comparable projects in the same category.
```

This is important for explainability.

---

# 19. EVIDENCE SECTION

Show:

```text
Risk Indicator
Supporting Value
Explanation
Recommended Action
```

Example:

```text
Progress Mismatch
Gap: 41%

Requires physical-progress verification.
```

---

# 20. FINANCIAL ANALYSIS PAGE

Route:

```text
/financial-analysis
```

Show:

* cost deviation
* sanctioned amount
* estimated cost
* actual cost
* expenditure
* expenditure ratio
* remaining amount

Charts:

* expenditure distribution
* cost comparison
* state-wise expenditure
* project cost outliers

Add a table:

```text
Project
Estimated Cost
Actual Cost
Deviation
Financial Risk
```

---

# 21. PROGRESS MONITORING PAGE

Route:

```text
/progress-monitoring
```

Display:

* physical progress
* financial progress
* progress gap
* project duration
* delay days
* status

Create visual comparison charts.

Highlight projects where:

```text
Financial Progress >> Physical Progress
```

---

# 22. RISK DASHBOARD

Route:

```text
/risk
```

Display:

* critical projects
* high-risk projects
* risk distribution
* risk trends
* top risk factors
* highest-risk projects

Create a table:

```text
Project
Risk Score
Risk Level
Primary Risk
Status
```

---

# 23. MAP PAGE

Route:

```text
/map
```

Use Leaflet.

Display projects using geographic markers.

Each project has:

```text
latitude
longitude
risk level
```

Click marker:

```text
Project ID
Project Name
Risk Score
Status
View Project
```

Add filters:

```text
All
Low
Medium
High
Critical
```

---

# 24. GEOTAGGED PHOTO VERIFICATION

This is a CORE feature.

Keep this feature simple.

Do NOT make complex computer vision mandatory.

## Workflow

```text
Select Project
↓
Upload Photo
↓
Extract GPS Metadata
↓
Extract Timestamp
↓
Compare GPS
↓
Calculate Distance
↓
Return Verification Result
```

---

# 25. PHOTO VERIFICATION PAGE

Route:

```text
/photo-verification
```

Build a professional interface.

Left side:

```text
Select Project
Upload Photo
Photo Preview
```

Right side:

```text
Photo Information
GPS Coordinates
Project Coordinates
Distance
Timestamp
GPS Status
Timestamp Status
Overall Verification
```

Example:

```text
Project Location
18.5204, 73.8567

Photo Location
18.5210, 73.8572

Distance
82 meters

GPS Status
Consistent

Timestamp
Verified

Photo Verification
PASS
```

Another example:

```text
Distance
3.4 km

GPS Status
Requires Review
```

---

# 26. GEOTAG CALCULATION

Implement Haversine distance.

Input:

```text
Project latitude
Project longitude
Photo latitude
Photo longitude
```

Output:

```text
distance in meters
```

Make the allowed distance configurable.

Do not claim that the chosen distance threshold is an official MPLADS rule.

---

# 27. PHOTO METADATA

Extract where available:

* GPS
* latitude
* longitude
* timestamp
* camera/device

If metadata is unavailable:

Display:

```text
GPS metadata unavailable
Requires Review
```

Do not automatically label it fraudulent.

---

# 28. PHOTO DUPLICATE CHECK

Include a simple optional duplicate check using perceptual hashing.

Pipeline:

```text
Photo
↓
pHash
↓
Compare Historical Photos
↓
Similarity
```

Show:

```text
No similar photo found
```

or:

```text
Potentially reused photo
Similarity: 94%
Requires Review
```

---

# 29. SIMILAR PROJECTS

Route:

```text
/similar-projects
```

Use Sentence Transformers + cosine similarity.

Compare project descriptions.

Display:

```text
Current Project
Similar Project
Similarity Score
Work Type
Location
Cost
```

Use:

**Potentially Similar Work**

not:

**Fraudulent Duplicate**

---

# 30. SIMPLE AI/ML SYSTEM

The AI/ML service should focus on useful techniques only.

Use:

## 1. Rule-Based Analysis

For:

* cost deviation
* progress gap
* delay
* expenditure ratio

## 2. Isolation Forest

For:

* unusual project patterns
* financial anomalies
* unusual progress
* unusual expenditure

## 3. Peer Comparison

Compare projects with similar:

* state
* district
* work type

## 4. Sentence Transformer

For:

* similar project descriptions

## 5. Geotag Verification

For:

* GPS distance
* timestamp consistency

This is enough for V1.

---

# 31. FEATURE ENGINEERING

Calculate:

## Cost Deviation

```text
((Actual Cost - Estimated Cost) / Estimated Cost) × 100
```

## Expenditure Ratio

```text
(Expenditure / Sanctioned Amount) × 100
```

## Financial Progress

```text
(Expenditure / Sanctioned Amount) × 100
```

## Progress Gap

```text
Financial Progress - Physical Progress
```

## Remaining Amount

```text
Sanctioned Amount - Expenditure
```

## Delay Days

Calculate from expected completion date.

---

# 32. RULE-BASED RISK

Create configurable rules.

Examples:

```text
High cost deviation → financial risk

Large progress gap → progress risk

Large delay → delay risk

Unusual expenditure → financial risk

Unusual peer deviation → peer risk

GPS mismatch → photo risk
```

Each rule produces:

```json
{
  "indicator": "PROGRESS_MISMATCH",
  "severity": "HIGH",
  "value": 41,
  "message": "Financial progress significantly exceeds physical progress"
}
```

---

# 33. ISOLATION FOREST

Use Isolation Forest for unsupervised anomaly detection.

Features:

```text
costDeviation
expenditureRatio
financialProgress
physicalProgress
progressGap
delayDays
sanctionedAmount
estimatedCost
actualCost
remainingAmount
```

Output:

```text
isAnomaly
anomalyScore
mlRisk
```

Do not claim the result proves fraud.

---

# 34. PEER COMPARISON

Compare projects using:

```text
State
District
Work Type
Category
Agency
```

Calculate:

```text
Average Cost
Median Cost
Average Progress
Average Delay
```

Show the difference between:

```text
Current Project
vs
Peer Projects
```

---

# 35. UNIFIED RISK SCORE

Create one risk score:

```text
0–100
```

Use a simple configurable weighting:

```text
Financial Risk     25%
Progress Risk      25%
Delay Risk         15%
ML Anomaly         15%
Photo Risk         10%
Peer Risk           5%
Similarity Risk     5%
```

Risk levels:

```text
0–30     LOW
31–60    MEDIUM
61–80    HIGH
81–100   CRITICAL
```

These are prototype thresholds.

They are NOT official government thresholds.

---

# 36. RISK ENGINE OUTPUT

Example:

```json
{
  "projectId": "MPLADS-001",
  "financialRisk": 78,
  "progressRisk": 85,
  "delayRisk": 72,
  "mlRisk": 68,
  "photoRisk": 15,
  "peerRisk": 64,
  "similarityRisk": 30,
  "overallRisk": 73,
  "riskLevel": "HIGH"
}
```

Also return:

```text
indicators
reasons
recommendations
```

---

# 37. RECOMMENDATION ENGINE

Examples:

```text
High financial risk
→ Review expenditure records

High progress mismatch
→ Verify physical progress

High delay
→ Request updated project status

GPS mismatch
→ Verify project location

Potentially similar work
→ Review project records
```

---

# 38. ALERTS

Route:

```text
/alerts
```

Display:

```text
Critical Alerts
High Alerts
Medium Alerts
Resolved Alerts
```

Alert fields:

```text
Alert ID
Project
Severity
Reason
Risk Score
Date
Status
```

Statuses:

```text
NEW
REVIEWING
RESOLVED
DISMISSED
```

---

# 39. AI ASSISTANT

Route:

```text
/ai-assistant
```

Keep this simple.

Do not build a complicated LLM system initially.

Create predefined analytical questions:

```text
Show critical projects

Show delayed projects

Show highest cost deviations

Show projects with large progress gaps

Why is project P123 high risk?
```

The assistant should retrieve actual database/analysis results.

For the first version, a rule-based query assistant is acceptable.

---

# 40. USERS PAGE

Route:

```text
/users
```

Display:

```text
Name
Role
State
District
Status
Last Login
```

Roles:

```text
MINISTRY_ADMIN
STATE_AUTHORITY
DISTRICT_AUTHORITY
OFFICER
ANALYST
```

Implement RBAC in backend.

---

# 41. AUDIT LOG PAGE

Route:

```text
/audit-logs
```

Show:

```text
User
Action
Entity
Entity ID
Timestamp
```

Examples:

```text
Project analyzed
Photo uploaded
Alert resolved
Project updated
User logged in
```

---

# 42. BACKEND MODELS

Create:

```text
User
Project
ProjectRisk
Payment
ProjectPhoto
PhotoVerification
SimilarProject
Alert
AuditLog
ModelResult
```

---

# 43. PROJECT DATA MODEL

Fields:

```text
projectId
state
district
constituency
mp
description
workType
category
agency
contractor

sanctionedAmount
estimatedCost
actualCost
expenditure

physicalProgress
financialProgress

startDate
expectedCompletionDate
actualCompletionDate

status

latitude
longitude

createdAt
updatedAt
```

---

# 44. BACKEND API

## Auth

```text
POST /api/auth/login
GET /api/auth/me
```

## Projects

```text
GET /api/projects
GET /api/projects/:projectId
POST /api/projects
PUT /api/projects/:projectId
```

## Risk

```text
GET /api/risk/high
GET /api/risk/critical
GET /api/risk/:projectId
POST /api/risk/analyze/:projectId
```

## Dashboard

```text
GET /api/dashboard/summary
GET /api/dashboard/state/:state
GET /api/dashboard/district/:district
GET /api/dashboard/risk-distribution
GET /api/dashboard/trends
```

## Photos

```text
POST /api/projects/:projectId/photos
GET /api/projects/:projectId/photos
POST /api/photos/:photoId/verify
GET /api/photos/:photoId/verification
```

## Similarity

```text
GET /api/projects/:projectId/similar
POST /api/projects/:projectId/similarity
```

## Alerts

```text
GET /api/alerts
GET /api/alerts/critical
PATCH /api/alerts/:alertId
```

---

# 45. AI SERVICE

Use FastAPI.

Endpoints:

```text
GET /ai/health

POST /ai/analyze-project

POST /ai/financial-analysis

POST /ai/progress-analysis

POST /ai/delay-analysis

POST /ai/anomaly

POST /ai/similarity

POST /ai/photo-verify

POST /ai/risk-score
```

---

# 46. FRONTEND MOCK DATA MODE

This is very important.

Until backend APIs are available, frontend should use:

```text
frontend/src/data/
```

Create:

```text
projects.js
dashboard.js
risk.js
alerts.js
photos.js
```

The UI must look complete using synthetic data.

Later replace:

```text
mockService
```

with:

```text
apiService
```

without changing page structures.

---

# 47. SYNTHETIC DATA

Create synthetic MPLADS-style data.

Include:

* normal projects
* delayed projects
* high-cost projects
* progress mismatch
* high-risk projects
* critical projects
* similar descriptions
* geotagged photo examples

Clearly display:

# SYNTHETIC DEMO DATA

in the application where appropriate.

Never represent synthetic data as actual government fraud evidence.

---

# 48. FRONTEND SCREENSHOT REQUIREMENT

The first implementation must prioritize screenshot-ready screens.

At minimum these pages must look complete:

```text
1. Login
2. Dashboard
3. Projects
4. Project Details
5. Risk Dashboard
6. Financial Analysis
7. Progress Monitoring
8. Photo Verification
9. Map
10. Alerts
11. Similar Projects
```

These pages must contain realistic data and polished layouts.

---

# 49. SCREENSHOT PRIORITY

Most important screenshots:

## Screenshot 1

National Dashboard

Must show:

* KPI cards
* charts
* risk distribution
* map/insights
* project summary

## Screenshot 2

Project Details

Must show:

* project information
* financial data
* progress
* timeline
* risk score
* reasons

## Screenshot 3

Photo Verification

Must show:

* uploaded photo
* GPS
* distance
* timestamp
* verification result

## Screenshot 4

Risk Dashboard

Must show:

* high-risk projects
* critical projects
* risk factors
* charts

## Screenshot 5

Map

Must show:

* project markers
* different risk levels
* project details

---

# 50. FRONTEND RESPONSIVENESS

Support:

* desktop
* laptop
* tablet
* mobile

Desktop should be the primary target.

---

# 51. COMPONENT REUSE

Create reusable components:

```text
Sidebar
Topbar
KpiCard
RiskBadge
ProjectTable
ProgressBar
RiskScore
ChartCard
FilterBar
AlertCard
ProjectCard
Modal
LoadingState
EmptyState
ErrorState
```

Do not duplicate UI code.

---

# 52. LOADING / ERROR STATES

Every API-driven page should support:

```text
Loading
Success
Empty
Error
```

Mock-data mode should also look realistic.

---

# 53. BACKEND SECURITY

Implement:

* JWT
* bcrypt
* protected routes
* role checking
* validation
* Helmet
* CORS
* rate limiting
* upload validation
* environment variables

Never hard-code secrets.

---

# 54. PHOTO SECURITY

Validate:

* file type
* file size
* image integrity

Store photo metadata separately from the binary file.

---

# 55. ERROR HANDLING

Handle:

```text
Database failure
AI service unavailable
Invalid project
Invalid photo
Unauthorized request
Forbidden request
Malformed data
ML failure
```

---

# 56. TESTING

## Backend

Test:

* login
* project API
* risk API
* dashboard API
* photo API

## AI

Test:

* cost deviation
* progress gap
* delay calculation
* Isolation Forest
* similarity
* GPS distance
* risk score

## Frontend

Test:

* routing
* login
* dashboard
* project explorer
* project details
* photo verification

---

# 57. DOCKER

Create:

```text
docker-compose.yml
```

Services:

```text
frontend
backend
ai-service
mongodb
```

Make sure local development without Docker is also possible.

---

# 58. DOCUMENTATION

Create:

```text
docs/
├── ARCHITECTURE.md
├── API_CONTRACTS.md
├── ML_PIPELINE.md
├── IMPLEMENTATION_STATUS.md
└── LIMITATIONS.md
```

---

# 59. IMPLEMENTATION PHASES

## PHASE 0 — Complete Frontend Foundation

Priority: VERY HIGH

Create:

* React project
* Tailwind
* routing
* layout
* sidebar
* topbar
* theme
* reusable components

---

## PHASE 1 — Screenshot-Ready Frontend

Build:

* login
* dashboard
* projects
* project details
* risk
* financial
* progress
* photo verification
* map
* alerts
* similar projects

Use synthetic mock data.

### Acceptance Criteria

Every major page should look complete and screenshot-ready.

---

## PHASE 2 — MongoDB + Backend

Implement:

* database
* models
* authentication
* projects
* dashboards
* alerts
* photo storage

---

## PHASE 3 — Feature Engineering

Implement:

* cost deviation
* expenditure ratio
* financial progress
* progress gap
* delay
* remaining amount

---

## PHASE 4 — Rule-Based Risk

Implement:

* financial indicators
* progress indicators
* delay indicators
* simple peer indicators

---

## PHASE 5 — Isolation Forest

Implement:

* training
* saving
* loading
* prediction
* anomaly score

---

## PHASE 6 — Unified Risk Engine

Implement:

* component scores
* overall score
* risk level
* reasons
* recommendations

---

## PHASE 7 — Peer + Similarity

Implement:

* peer comparison
* Sentence Transformer
* cosine similarity

---

## PHASE 8 — Geotagged Photos

Implement:

* photo upload
* EXIF
* GPS
* timestamp
* Haversine distance
* verification score

Optional:

* pHash duplicate detection

---

## PHASE 9 — Integration

Connect:

```text
React
↓
Node
↓
MongoDB
↓
FastAPI
↓
ML
↓
Node
↓
React
```

Replace frontend mock data with real APIs.

---

## PHASE 10 — Final Polish

Improve:

* UI
* responsiveness
* error handling
* security
* loading states
* testing
* documentation
* demo workflow

---

# 60. PHASE COMPLETION RULE

A phase is complete only when:

```text
Implementation
+
Testing
+
Integration
+
Documentation
```

is complete.

Update:

```text
docs/IMPLEMENTATION_STATUS.md
```

after each phase.

---

# 61. DO NOT OVER-ENGINEER

Do NOT add these to V1 unless there is sufficient time:

```text
YOLO
ViT
Complex computer vision
Advanced LLM agents
Multiple AI microservices
Complex message queues
Kubernetes
Complex cloud architecture
Advanced payment fraud models
Complex MLOps
```

These can be future improvements.

---

# 62. CORE AI/ML V1

The main AI/ML story should be:

```text
Feature Engineering
        ↓
Rule-Based Indicators
        ↓
Isolation Forest
        ↓
Peer Comparison
        ↓
Text Similarity
        ↓
Geotag Verification
        ↓
Unified Risk Engine
```

This provides a strong but manageable technical story for the hackathon.

---

# 63. FINAL DEMO WORKFLOW

The system must support:

```text
Login
 ↓
Dashboard
 ↓
Project Explorer
 ↓
Select Project
 ↓
Project Details
 ↓
Run Analysis
 ↓
Financial Analysis
 ↓
Progress Analysis
 ↓
Delay Analysis
 ↓
Isolation Forest
 ↓
Peer Comparison
 ↓
Geotag Photo Verification
 ↓
Unified Risk Score
 ↓
Explainable Indicators
 ↓
Alert
 ↓
Human Review
```

---

# 64. DEMO PROJECT

Create one strong synthetic project specifically for demonstration.

Example:

```text
Project ID:
MPLADS-DEMO-001

State:
Maharashtra

District:
Pune

Work Type:
Road Construction

Sanctioned Amount:
₹15,00,000

Estimated Cost:
₹12,00,000

Actual Cost:
₹18,50,000

Expenditure:
₹13,50,000

Physical Progress:
42%

Financial Progress:
90%

Delay:
120 days
```

This project should produce multiple risk indicators.

Display:

```text
Overall Risk: 84
Risk Level: CRITICAL
```

with reasons such as:

```text
Large financial/physical progress mismatch
High cost deviation
Project delay
Unusual project pattern
Peer-group deviation
```

Clearly identify this as synthetic demo data.

---

# 65. FINAL FRONTEND QUALITY STANDARD

The frontend must look like a **finished product**, not a developer prototype.

Avoid:

```text
Lorem ipsum
empty charts
blank cards
unfinished tables
default browser styles
huge placeholder text
"coming soon"
```

Use realistic data everywhere.

---

# 66. FINAL ANTIGRAVITY OPERATING RULE

When Antigravity starts:

1. Read `implementation.md`.
2. Inspect the existing repository.
3. Check `docs/IMPLEMENTATION_STATUS.md`.
4. Determine the current phase.
5. Implement only the next required phase.
6. Preserve existing architecture.
7. Do not unnecessarily rewrite working code.
8. Run the application.
9. Test the implementation.
10. Fix errors.
11. Update documentation.
12. Update implementation status.
13. Report completed work.

---

# 67. FIRST PRIORITY FOR ANTIGRAVITY

When starting from an empty repository:

## PRIORITY 1

Build the complete screenshot-ready frontend.

Create:

```text
Login
Dashboard
Projects
Project Details
Risk Dashboard
Financial Analysis
Progress Monitoring
Photo Verification
Map
Alerts
Similar Projects
AI Assistant
Users
Audit Logs
```

Use realistic synthetic data.

The frontend must run independently.

After this, proceed to backend.

---

# 68. FRONTEND DATA ABSTRACTION

Use a service layer.

Example:

```text
frontend/src/services/
```

Create:

```text
projectService.js
riskService.js
dashboardService.js
photoService.js
alertService.js
```

Initially:

```text
service → mock data
```

Later:

```text
service → Axios API
```

The UI should not know whether the data is mock or real.

---

# 69. FINAL ACCEPTANCE CRITERIA

Nirikshan-AI V1 is considered successful when:

```text
✓ Frontend fully works
✓ All important pages are visually complete
✓ Screenshot-ready dashboard exists
✓ Project details page exists
✓ Risk visualization exists
✓ Map exists
✓ Geotagged photo verification exists
✓ Backend APIs work
✓ MongoDB works
✓ AI service works
✓ Feature engineering works
✓ Isolation Forest works
✓ Unified risk score works
✓ Alerts work
✓ Basic authentication works
✓ Mock data can be replaced by real data
✓ Documentation exists
✓ No major runtime errors
```

---

# 70. PRIORITY SUMMARY

When time is limited:

## MUST HAVE

```text
Frontend
Dashboard
Projects
Project Details
Financial Analysis
Progress Monitoring
Risk Engine
Backend
MongoDB
Isolation Forest
Geotagged Photos
Alerts
```

## SHOULD HAVE

```text
Peer Comparison
Similar Projects
Map
Audit Logs
RBAC
```

## OPTIONAL

```text
AI Assistant
pHash duplicate detection
Advanced computer vision
```

---

# 71. CORE PRODUCT MESSAGE

Nirikshan-AI is not simply a fraud detector.

It is:

**An AI-powered project monitoring and risk intelligence platform that helps authorities identify unusual patterns, monitor progress, verify geotagged evidence, and prioritize projects for human review.**

---

# END OF IMPLEMENTATION.MD
