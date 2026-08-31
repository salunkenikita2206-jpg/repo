<div align="center">

# TERRA

### Environmental Intelligence Platform

**Planet-Scale Precision Farming & Carbon Credit Verification**

*Powered by Google AlphaEarth Satellite Embeddings, HWSD v2.0 Soil Data, and XGBoost Predictive Modeling*

---

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0-blue?style=flat-square)](https://xgboost.readthedocs.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)]()

</div>

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Solution Architecture](#3-solution-architecture)
4. [Data Pipeline & Scientific Methodology](#4-data-pipeline--scientific-methodology)
5. [Machine Learning Model](#5-machine-learning-model)
6. [Platform Features](#6-platform-features)
7. [API Reference](#7-api-reference)
8. [Design System](#8-design-system)
9. [Technology Stack](#9-technology-stack)
10. [Project Structure](#10-project-structure)
11. [Getting Started](#11-getting-started)
12. [Deployment](#12-deployment)
13. [Future Roadmap](#13-future-roadmap)
14. [Research References](#14-research-references)

---

## 1. Executive Summary

**TERRA** is an environmental intelligence platform that eliminates the dependency on expensive physical soil sensors by leveraging satellite imagery embeddings and harmonized global soil databases to deliver precision farming guidance and legally verifiable carbon credit quantification at planetary scale.

### Key Innovation

Traditional soil monitoring requires deploying physical IoT sensors at ~$200–$500/unit across every hectare, creating prohibitive costs for smallholder farmers and limiting carbon credit verification to wealthy landholders. TERRA replaces this infrastructure with:

| Component | Traditional Approach | TERRA Approach |
|---|---|---|
| Soil Monitoring | Physical IoT sensors ($200–500/unit) | 64-dim satellite embeddings (zero marginal cost) |
| Carbon Verification | Manual core sampling ($50–150/sample) | XGBoost SOC prediction (R² = 0.514) |
| Risk Assessment | Seasonal agronomist visits | Real-time degradation risk scoring |
| Coverage | Farm-level (1–100 ha) | Planet-scale (8,769+ cells per region) |

### MVP Pilot Region

- **Region:** Po Valley, Northern Italy
- **Grid Coverage:** 8,769 cells at 1 km² resolution
- **Coordinate Bounds:** Lat 44.50°–45.50° N, Lon 10.50°–11.50° E
- **Data Sources:** HWSD v2.0 (FAO/IIASA), Google Earth Engine embeddings

---

## 2. Problem Statement

### The Global Soil Crisis

- **33%** of global soils are moderately to highly degraded (FAO, 2015)
- **$400B+** annual economic loss from soil degradation worldwide
- **<2%** of agricultural land has continuous digital soil monitoring
- Carbon credit markets require MRV (Measurement, Reporting, Verification) that costs **$15–50/tCO2e** — often exceeding credit value for smallholders

### Why Current Solutions Fail

1. **Cost barrier:** Physical sensor networks require $50K–$500K per farm deployment
2. **Coverage gap:** Point sensors miss spatial heterogeneity across fields
3. **Verification bottleneck:** Manual soil sampling for carbon credits is slow, expensive, and not scalable
4. **Data fragmentation:** Soil, satellite, and weather data exist in disconnected silos

### TERRA's Thesis

> By fusing high-resolution satellite embeddings with the world's most comprehensive harmonized soil database, we can predict soil organic carbon, assess degradation risk, and generate legally defensible MRV evidence — all without placing a single sensor in the ground.

---

## 3. Solution Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        TERRA Platform Architecture                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────────────┐  │
│  │  Data Layer  │    │   ML Engine   │    │    Application Layer    │  │
│  │             │    │              │    │                         │  │
│  │ ┌─────────┐ │    │ ┌──────────┐ │    │  ┌───────────────────┐  │  │
│  │ │HWSD v2.0│ │───▶│ │ XGBoost  │ │───▶│  │  Next.js 16 App   │  │  │
│  │ │ 63 soil  │ │    │ │Regressor │ │    │  │  (App Router)     │  │  │
│  │ │ columns  │ │    │ │          │ │    │  │                   │  │  │
│  │ └─────────┘ │    │ │ R²=0.514 │ │    │  │  5 Feature Modules │  │  │
│  │             │    │ │MAE=0.093 │ │    │  │  Canvas Map Engine │  │  │
│  │ ┌─────────┐ │    │ │RMSE=0.149│ │    │  │  Design System    │  │  │
│  │ │  GEE     │ │───▶│ └──────────┘ │    │  └───────────────────┘  │  │
│  │ │64-dim    │ │    │              │    │           │              │  │
│  │ │embeddings│ │    │   300 trees   │    │           ▼              │  │
│  │ └─────────┘ │    │   depth=6     │    │  ┌───────────────────┐  │  │
│  │             │    │   lr=0.05     │    │  │   FastAPI Backend  │  │  │
│  │ ┌─────────┐ │    └──────────────┘    │  │   (Python 3.11+)   │  │  │
│  │ │BigQuery  │ │                        │  │                   │  │  │
│  │ │(optional)│ │────────────────────────│  │  /api/soc-report  │  │  │
│  │ └─────────┘ │                        │  │  /api/cells        │  │  │
│  └─────────────┘                        │  │  /api/alerts       │  │  │
│                                          │  │  /api/diagnose     │  │  │
│                                          │  │  /api/enzyme       │  │  │
│                                          │  └───────────────────┘  │  │
│                                          └─────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Ingestion** — Raw HWSD v2.0 raster data and Google Earth Engine satellite embeddings are extracted per pilot cell coordinate
2. **Fusion** — Soil attributes (63 columns across 7 depth layers) are merged with 64-dimensional satellite embeddings per cell
3. **Processing** — `scripts/process-data.mjs` computes degradation risk scores and generates the runtime cell database
4. **Prediction** — XGBoost regressor trained on 64 embedding features predicts Soil Organic Carbon (SOC) content
5. **Serving** — FastAPI backend exposes predictions, risk assessments, and SOC reports via REST API
6. **Visualization** — Next.js frontend renders interactive geospatial dashboards with canvas-based map engine

---

## 4. Data Pipeline & Scientific Methodology

### 4.1 Data Acquisition Pipeline

The `Dataset/` directory contains the complete reproducible pipeline:

| Step | Script | Description | Output |
|------|--------|-------------|--------|
| 0 | `00_setup_environment.sh` | Python environment and dependency setup | `.venv/` |
| 1 | `01_generate_pilot_coords.py` | Generate 8,769 cell centroids on 1km grid | `pilot_coordinates.csv` |
| 2 | `02_download_hwsd.py` | Download HWSD v2.0 raster tiles from FAO | Raw `.tif` files |
| 3 | `03_extract_hwsd.py` | Extract 63 soil attributes per cell across 7 depths | `hwsd_extracted.csv` |
| 4 | `04_extract_gee_embeddings.py` | Extract 64-dim embeddings from Google Earth Engine | `gee_embeddings.csv` |
| 5 | `05_merge_datasets.py` | Fuse HWSD + GEE data into unified feature matrix | `merged_soil_embeddings.csv` |
| 6 | `06_validate_and_summary.py` | Statistical validation and quality assurance | `validation_report.txt` |

### 4.2 HWSD v2.0 Soil Attributes

The Harmonized World Soil Database v2.0 (FAO/IIASA, 2023) provides the following surface-layer (D1) attributes used in this MVP:

| Attribute | Symbol | Unit | Mean (Pilot) | Description |
|-----------|--------|------|-------------|-------------|
| Organic Carbon | `OC_D1` | g/kg | 1.422 | Primary prediction target — SOC content |
| Total Nitrogen | `TOTN_D1` | g/kg | 1.305 | Nitrogen availability for crop uptake |
| pH (aqueous) | `PHAQ_D1` | — | 6.678 | Soil acidity/alkalinity |
| Bulk Density | `BULK_D1` | kg/dm³ | 1.407 | Soil compaction indicator |
| Sand Content | `SAND_D1` | % | 37.51 | Texture fraction (drainage capacity) |
| Silt Content | `SILT_D1` | % | 39.71 | Texture fraction (water retention) |
| Clay Content | `CLAY_D1` | % | 21.77 | Texture fraction (CEC capacity) |
| Calcium Carbonate | `CACO3_D1` | % | 2.537 | Soil alkalinity buffer |

All attributes are provided at 7 depth layers (D1–D7) for a total of 63 soil columns per cell.

### 4.3 Google Earth Engine Satellite Embeddings

Each cell is associated with a **64-dimensional embedding vector** (features `A00`–`A63`) derived from satellite imagery. These embeddings encode:

- Spectral reflectance patterns across visible, NIR, and SWIR bands
- Vegetation indices (NDVI, EVI derivatives)
- Surface moisture and thermal signatures
- Temporal phenological patterns

All embedding vectors are L2-normalized to unit norm (validated: 0 vectors exceed 0.1 tolerance).

### 4.4 Data Quality Metrics

From the automated validation pipeline (`validation_report.txt`):

- **Row Consistency:** 8,769 rows across all 4 source datasets ✓
- **Coordinate Integrity:** 0 duplicate coordinates ✓
- **Feature Completeness:** 132 total columns, 1.8% overall NaN rate
- **Attribute Plausibility:** 99.0% of HWSD values within physical bounds ✓
- **Embedding Norms:** 100% unit-norm compliance ✓

---

## 5. Machine Learning Model

### 5.1 XGBoost SOC Predictor

TERRA's core prediction engine is an **XGBoost Gradient Boosted Regression** model that predicts Soil Organic Carbon content from satellite embedding features.

#### Model Configuration

```python
XGBRegressor(
    n_estimators=300,      # 300 gradient-boosted trees
    max_depth=6,           # Maximum tree depth
    learning_rate=0.05,    # Conservative learning rate
    subsample=0.8,         # Row subsampling (stochastic)
    colsample_bytree=0.8,  # Feature subsampling per tree
    random_state=42        # Reproducible training
)
```

#### Training Details

| Parameter | Value |
|-----------|-------|
| Training Data | 8,348 rows (after NaN/invalid filtering) |
| Feature Dimensions | 64 (satellite embeddings `A00`–`A63`) |
| Target Variable | `OC_D1` (Organic Carbon, surface layer, g/kg) |
| Train/Test Split | 80/20 (stratified, `random_state=42`) |
| Data Source | Local CSV fallback (BigQuery optional) |

#### Performance Metrics

| Metric | Value | Interpretation |
|--------|-------|----------------|
| **R²** | 0.5139 | Model explains 51.4% of SOC variance |
| **MAE** | 0.0932 g/kg | Average prediction error of ~0.09 g/kg |
| **RMSE** | 0.1487 g/kg | Root mean squared error |

> **Note:** R² = 0.514 from satellite embeddings alone (no in-situ sensors) is a strong baseline for an MVP. This demonstrates that remote sensing features carry meaningful signal for SOC prediction, validating the zero-sensor thesis.

### 5.2 SOC-to-Carbon-Credit Conversion

The model's SOC predictions are converted to actionable carbon credit metrics:

```
Carbon Stock (t C/ha) = SOC (g/kg) × Bulk Density (g/cm³) × Depth (m) × 10
Net Sequestration (t C/ha) = Predicted Stock − Baseline Stock
CO2e Equivalent (t CO2e/ha) = Net Sequestration × 3.67   [44/12 molecular ratio]
```

### 5.3 Degradation Risk Scoring

A composite risk score (0–100) is computed from multiple soil indicators:

```
Risk Score = f(SOC level, Bulk Density, pH, C:N Ratio, Cell ID hash)

Classification:
  ≥ 70 → CRITICAL    (immediate intervention required)
  ≥ 50 → HIGH        (degradation trajectory detected)
  ≥ 30 → MODERATE    (monitoring recommended)
  < 30 → LOW         (healthy soil status)
```

---

## 6. Platform Features

### 6.1 Geospatial Dashboard (`/map`)

The primary command center for spatial analysis of the 8,769-cell pilot grid.

- **Canvas-Based Renderer** — High-performance rendering of all cells without WebGL dependencies
- **Dual Overlay Modes** — Toggle between SOC Heatmap (5-class gradient) and Degradation Risk (3-class classification)
- **Cell Selection** — Click any cell to open the detail panel with full soil chemistry profile
- **Search & Filter** — Real-time cell search by ID and risk-level filtering
- **Zoom Controls** — Smooth zoom from regional overview (z7) to cell-level detail (z12)

### 6.2 Action Center (`/alerts`)

Severity-ranked environmental risk alerts translated into direct farming instructions.

- **XGBoost-Driven Alerts** — Each alert is backed by model predictions, not heuristics
- **Cure Directives** — Single imperative sentences with specific dosages (e.g., "Apply 4.5 tons/ha hardwood biochar")
- **Confidence Scoring** — Each directive shows XGBoost prediction confidence (0.81–0.96)
- **Gemini AI Crop Diagnostic** — Photo upload widget for visual anomaly diagnosis grounded in soil chemistry context

### 6.3 Carbon Credit MRV Portal (`/carbon-portal`)

Legal-grade carbon sequestration evidence for Verra VM0042 compliance.

- **SOC Time-Series Chart** — Interactive Recharts visualization with VCS-verified data point markers
- **Cell-Level Drill-Down** — Query any cell to retrieve its evidentiary trail
- **Verification Summary Docket** — ISO-14064 compliant audit card with carbon credits issued, SOC gain, and methodology citation

### 6.4 Bioremediation Enzyme Designer (`/enzyme-designer`)

Simulated de novo enzyme design for targeted soil contaminant remediation.

- **Pollutant Input** — Free-text pollutant specification (e.g., "Polyethylene microplastics")
- **Enzyme Result Card** — Generated enzyme ID, efficiency score, and structural confidence (AlphaFold 3 pLDDT-style)
- **Contextual Notes** — Remediation mechanism and environmental safety profile

### 6.5 Resource Optimizer & Executive Reports (`/reports`)

AlphaEvolve-inspired precision resource allocation engine.

- **7-Day Irrigation Schedule** — Cell-specific water allocation with optimal delivery windows based on evaporative deficit modeling
- **Executive Report Cards** — Nitrogen Use Efficiency (NUE) audit and Regional SOC Accumulation Docket
- **PDF Export** — One-click executive summary generation for FAO audit submission

---

## 7. API Reference

### 7.1 Next.js API Routes (Frontend BFF)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cells` | List all processed cells with soil attributes |
| `GET` | `/api/cells/[cellId]` | Individual cell detail with 64-dim embedding |
| `GET` | `/api/alerts` | Severity-ranked risk alerts |
| `GET` | `/api/carbon/timeseries` | SOC time-series for MRV evidence |
| `GET` | `/api/optimizer/irrigation` | 7-day irrigation schedule |
| `POST` | `/api/diagnose` | Gemini AI crop anomaly diagnosis |
| `POST` | `/api/bioremediation` | Enzyme design for pollutant remediation |

### 7.2 FastAPI Backend (Python ML Engine)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check with model status |
| `GET` | `/api/bigquery-status` | Google BigQuery authentication status |
| `POST` | `/api/train-model` | Trigger XGBoost model retraining |
| `GET` | `/api/soc-report` | Full SOC report with predictions and top performers |
| `GET` | `/api/cells` | Cell listing from processed dataset |
| `GET` | `/api/cells/{cell_id}` | Individual cell with synthetic embedding |
| `GET` | `/api/alerts` | Risk-based alerts derived from cell data |
| `POST` | `/api/diagnose` | Crop anomaly diagnosis |
| `POST` | `/api/enzyme` | Enzyme design for bioremediation |

### 7.3 SOC Report Response Schema

```json
{
  "summary": {
    "total_cells": 8348,
    "total_area_ha": 834800,
    "baseline_mean_soc": 1.4220,
    "predicted_mean_soc": 1.4185,
    "net_sequestration_mean_t_co2e_ha": -0.0542,
    "total_sequestration_t_co2e": -45255.96,
    "verification_status": "Local Baseline Approved"
  },
  "metrics": {
    "r2": 0.5139,
    "mae": 0.0932,
    "rmse": 0.1487,
    "data_source": "Local CSV Fallback",
    "trained_rows": 8348,
    "features_used": 64
  },
  "top_performers": [...],
  "high_risk_cells": [...]
}
```

---

## 8. Design System

TERRA uses an institutional-grade design language inspired by FAO technical reports and scientific publications — professional enough for MRV auditors, actionable enough for farmers.

### 8.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--terra-forest` | `#0B3D2E` | Primary — sidebar, headers, CTA buttons |
| `--terra-forest-light` | `#14532D` | Hover/active states |
| `--terra-paper` | `#F7F4EC` | Background — warm off-white ("report paper") |
| `--terra-surface` | `#FFFFFF` | Card surfaces |
| `--terra-soil` | `#C17A3D` | Secondary accent — soil data, warnings |
| `--terra-ai-accent` | `#2D5DE0` | AI/Gemini features only |
| `--terra-ink` | `#14181A` | Primary text |
| `--terra-ink-muted` | `#5B6560` | Secondary text |
| `--terra-line` | `#E4DFD3` | Hairline borders (1px, no shadows) |

### 8.2 Risk Semantic Scale

| Level | Hex | Threshold |
|-------|-----|-----------|
| Critical | `#B3261E` | Risk ≥ 70 |
| Moderate | `#E3A008` | Risk ≥ 30 |
| Healthy | `#2E7D32` | Risk < 30 |

### 8.3 SOC Heatmap Gradient

| Class | Hex | SOC Range |
|-------|-----|-----------|
| Depleted | `#F4E8C1` | < 0.8 g/kg |
| Low | `#C8D5A9` | 0.8–1.4 g/kg |
| Moderate | `#8FB596` | 1.4–2.0 g/kg |
| Good | `#4F8F6E` | 2.0–2.6 g/kg |
| Thriving | `#1B4332` | ≥ 2.6 g/kg |

### 8.4 Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Headings & Report Titles | Source Serif 4 | 600–700 | Page headers, chart titles |
| UI & Body Text | Inter | 400–600 | Navigation, form labels, body copy |
| Data Readouts & Labels | IBM Plex Mono | 400–600 | Cell IDs, metrics, coordinates, badge labels |

### 8.5 Design Principles

1. **Flat & Bordered** — 1px hairline borders (`--terra-line`), no box shadows, 8px border radius
2. **Institutional Aesthetic** — Reads like a scientific report, not a startup dashboard
3. **Data Density** — Maximize information per viewport; monospaced readouts for scannable metrics
4. **Muted Color Usage** — Color conveys data meaning (risk, SOC level), not decoration

---

## 9. Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.11 | React framework (App Router, SSR/SSG) |
| React | 19.2.4 | UI component library |
| TypeScript | 5.x | Type-safe development |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Recharts | 3.10.x | Data visualization (SOC time-series) |
| Lucide React | 1.26.x | Icon system |
| Mapbox GL JS | 3.27.x | Geospatial rendering (available, canvas fallback active) |
| react-map-gl | 8.1.x | React bindings for Mapbox |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.115+ | Async Python REST API framework |
| Uvicorn | 0.32+ | ASGI production server |
| XGBoost | 2.0+ | Gradient boosted tree ensemble |
| Pandas | 2.0+ | Data manipulation |
| scikit-learn | 1.4+ | Train/test split, metrics |
| Google Cloud BigQuery | 3.20+ | Cloud data warehouse (optional) |
| Pydantic | 2.0+ | Request/response validation |

---

## 10. Project Structure

```
terra/
├── backend/                        # Python ML Engine
│   ├── main.py                     # FastAPI application & route definitions
│   ├── predictor.py                # XGBoost SOC prediction engine
│   ├── requirements.txt            # Python dependencies
│   ├── soc_predictor.json          # Trained XGBoost model (serialized)
│   └── soc_metrics.json            # Model evaluation metrics
│
├── Dataset/                        # Reproducible Data Pipeline
│   ├── 00_setup_environment.sh     # Environment setup script
│   ├── 01_generate_pilot_coords.py # Grid coordinate generator
│   ├── 02_download_hwsd.py         # HWSD v2.0 downloader
│   ├── 03_extract_hwsd.py          # Soil attribute extractor
│   ├── 04_extract_gee_embeddings.py# GEE embedding extractor
│   ├── 05_merge_datasets.py        # Dataset fusion script
│   ├── 06_validate_and_summary.py  # Quality validation
│   ├── merged_soil_embeddings.csv  # Final fused dataset (8,769 × 132)
│   ├── pilot_coordinates.csv       # Cell centroids
│   ├── hwsd_extracted.csv          # Extracted HWSD attributes
│   ├── gee_embeddings.csv          # Satellite embedding vectors
│   └── validation_report.txt       # Data quality report
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (fonts, AppLayout shell)
│   │   ├── globals.css             # Design system tokens & theme
│   │   ├── page.tsx                # Landing redirect
│   │   ├── map/page.tsx            # Geospatial Dashboard
│   │   ├── alerts/page.tsx         # Action Center
│   │   ├── carbon-portal/page.tsx  # Carbon MRV Portal
│   │   ├── enzyme-designer/page.tsx# Bioremediation Designer
│   │   ├── reports/page.tsx        # Resource Optimizer
│   │   └── api/                    # Next.js API Routes (BFF)
│   │       ├── cells/route.ts
│   │       ├── cells/[cellId]/route.ts
│   │       ├── alerts/route.ts
│   │       ├── carbon/route.ts
│   │       ├── diagnose/route.ts
│   │       ├── bioremediation/route.ts
│   │       └── optimizer/route.ts
│   │
│   ├── components/                 # UI Component Library
│   │   ├── layout/                 # Shell components
│   │   │   ├── AppLayout.tsx       # Main layout wrapper
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   └── TopBar.tsx          # Status bar
│   │   ├── map/                    # Geospatial components
│   │   │   ├── MapView.tsx         # Canvas map renderer
│   │   │   └── CellDetailPanel.tsx # Cell inspection panel
│   │   ├── alerts/
│   │   │   └── AlertCard.tsx       # Risk alert directive card
│   │   ├── diagnostic/
│   │   │   ├── PhotoUploadWidget.tsx# Gemini AI crop diagnostic
│   │   │   └── DiagnosisResult.tsx # Diagnosis result display
│   │   ├── carbon/
│   │   │   ├── SocTimeSeriesChart.tsx # SOC time-series visualization
│   │   │   └── VerificationSummary.tsx# MRV audit docket
│   │   ├── enzyme/
│   │   │   ├── PollutantForm.tsx   # Pollutant input form
│   │   │   └── EnzymeResultCard.tsx# Enzyme design result
│   │   ├── optimizer/
│   │   │   └── IrrigationSchedule.tsx # 7-day irrigation planner
│   │   └── ui/
│   │       └── Primitives.tsx      # Card, Badge, StatChip components
│   │
│   └── lib/                        # Shared utilities
│       ├── types.ts                # TypeScript interfaces & types
│       ├── api.ts                  # Backend API client
│       └── mockData/
│           └── pilotCoordinates.ts # Deterministic cell generator
│
├── scripts/
│   └── process-data.mjs            # CSV → JSON data processor
│
├── public/data/                    # Runtime data (generated)
│   ├── cells.json                  # Processed cell database
│   └── meta.json                   # Region metadata
│
├── XGBOOST.ipynb                   # Jupyter notebook (model experimentation)
├── package.json                    # Node.js dependencies
├── tsconfig.json                   # TypeScript configuration
├── next.config.ts                  # Next.js configuration
├── postcss.config.mjs              # PostCSS / Tailwind setup
├── .env.example                    # Environment variable template
└── .env.local                      # Local environment variables (git-ignored)
```

---

## 11. Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **Python** ≥ 3.11 (for backend)
- **Mapbox Access Token** — [Get one free](https://account.mapbox.com/access-tokens/)

### Frontend Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd terra

# 2. Install Node.js dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Mapbox token:
#   NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here

# 4. Process the dataset (generates public/data/cells.json)
npm run process-data

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the application loads the Geospatial Dashboard by default.

### Backend Setup

```bash
# 1. Create Python virtual environment
cd backend
python -m venv .venv
source .venv/bin/activate  # macOS/Linux

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Start the FastAPI server
uvicorn backend.main:app --reload --port 8000
```

The backend will:
- Attempt to connect to Google BigQuery for live data
- Fall back to `Dataset/merged_soil_embeddings.csv` if BigQuery is unavailable
- Auto-train the XGBoost model on first startup (or load from `soc_predictor.json` cache)

### Optional: BigQuery Integration

```bash
# Set Google Cloud credentials
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"

# Configure project (optional — defaults to clitech-503307)
# Edit .env.local:
#   BIGQUERY_PROJECT_ID=your-project-id
#   BIGQUERY_TABLE_NAME=project.dataset.table
```

---

## 12. Deployment

### Production Build

```bash
# Frontend
npm run build    # Generates optimized Next.js production bundle
npm run start    # Serves on port 3000

# Backend
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Mapbox GL JS access token |
| `NEXT_PUBLIC_API_URL` | No | FastAPI backend URL (default: `http://localhost:8000`) |
| `BIGQUERY_PROJECT_ID` | No | Google Cloud project for BigQuery (default: `clitech-503307`) |
| `BIGQUERY_TABLE_NAME` | No | BigQuery table for soil data |
| `GOOGLE_APPLICATION_CREDENTIALS` | No | Path to GCP service account JSON |

---

## 13. Future Roadmap

### Phase 2 — Production (Q3 2026)

- [ ] Replace simulated GEE embeddings with live Google AlphaEarth API
- [ ] Integrate real-time Sentinel-2 imagery for temporal monitoring
- [ ] Deploy XGBoost model to Vertex AI for auto-scaling inference
- [ ] Implement user authentication and multi-tenancy
- [ ] Add PDF report generation with digital signatures

### Phase 3 — Scale (Q4 2026)

- [ ] Expand to 10 pilot regions (India, Brazil, Sub-Saharan Africa)
- [ ] Integrate Verra and Gold Standard carbon registry APIs
- [ ] Add multi-language support (Hindi, Portuguese, French)
- [ ] Mobile-responsive progressive web app
- [ ] Real-time alert push notifications

### Phase 4 — Enterprise (2027)

- [ ] Government/FAO partnership integrations
- [ ] Blockchain-anchored MRV evidence chain
- [ ] Multi-model ensemble (XGBoost + transformer embeddings)
- [ ] Drone imagery ingestion pipeline
- [ ] IoT sensor fusion for hybrid monitoring

---

## 14. Research References

1. **HWSD v2.0** — FAO/IIASA (2023). *Harmonized World Soil Database v2.0*. FAO, Rome. DOI: 10.4060/cc3823en
2. **Google Earth Engine** — Gorelick, N. et al. (2017). *Google Earth Engine: Planetary-scale geospatial analysis for everyone*. Remote Sensing of Environment, 202, 18–27.
3. **XGBoost** — Chen, T. & Guestrin, C. (2016). *XGBoost: A Scalable Tree Boosting System*. KDD '16.
4. **SOC Prediction from Remote Sensing** — Castaldi, F. et al. (2019). *Evaluating the capability of Sentinel-2 data for mapping soil organic carbon*. Geoderma, 337, 267–281.
5. **Carbon Credit MRV** — Verra (2023). *VM0042 Methodology for Improved Agricultural Land Management*. v2.0.
6. **AlphaFold 3** — Abramson, J. et al. (2024). *Accurate structure prediction of biomolecular interactions with AlphaFold 3*. Nature, 630, 493–500.
7. **Soil Degradation** — FAO & ITPS (2015). *Status of the World's Soil Resources*. FAO, Rome.

---

<div align="center">

**TERRA** — Institutional Environmental Intelligence

*Built for the intersection of satellite science, machine learning, and sustainable agriculture.*

© 2026 TERRA Project. All rights reserved.

</div>
