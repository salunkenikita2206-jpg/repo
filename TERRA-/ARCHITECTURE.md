<![CDATA[# TERRA — Technical Architecture Document

**Version:** 0.1.0 (MVP)
**Classification:** Internal / DeepMind Review
**Last Updated:** July 2026

---

## 1. System Overview

TERRA is a dual-process architecture consisting of a **Next.js 16 application server** (frontend + BFF API layer) and a **FastAPI Python backend** (ML engine + data serving). The two processes communicate via HTTP REST, with the Next.js BFF acting as a proxy/aggregator for client-side requests.

```
                           ┌─────────────────────┐
                           │    Web Browser       │
                           │  (React 19 Client)   │
                           └──────────┬──────────┘
                                      │
                              HTTPS / Port 3000
                                      │
                           ┌──────────▼──────────┐
                           │   Next.js 16 Server  │
                           │   (App Router SSR)   │
                           │                      │
                           │  ┌────────────────┐  │
                           │  │ Server Comps   │  │  ← SSR: Map, Alerts, Reports
                           │  │ (RSC)          │  │
                           │  └────────────────┘  │
                           │  ┌────────────────┐  │
                           │  │ API Routes     │  │  ← BFF: /api/cells, /api/alerts, etc.
                           │  │ (route.ts)     │  │
                           │  └────────────────┘  │
                           └──────────┬──────────┘
                                      │
                              HTTP / Port 8000
                                      │
                           ┌──────────▼──────────┐
                           │   FastAPI Backend    │
                           │   (Python 3.11+)     │
                           │                      │
                           │  ┌────────────────┐  │
                           │  │ SOCPredictor   │  │  ← XGBoost model singleton
                           │  │ (predictor.py) │  │
                           │  └────────────────┘  │
                           │  ┌────────────────┐  │
                           │  │ BigQuery /     │  │  ← Data source (cloud/local)
                           │  │ Local CSV      │  │
                           │  └────────────────┘  │
                           └─────────────────────┘
```

---

## 2. Data Model

### 2.1 Cell Entity (Core Domain Object)

Every unit of analysis in TERRA is a **Cell** — a 1 km² geospatial unit on a regular grid.

```typescript
interface PilotCell {
  cell_id: string;           // e.g. "MH-0001"
  lat: number;               // WGS84 latitude
  lon: number;               // WGS84 longitude
  soc_percent: number;       // Soil Organic Carbon (g/kg)
  degradation_risk: RiskLevel;
  nitrogen_ppm: number;
  bulk_density_g_cm3: number;
  cn_ratio: number;
  land_use_type: 'cropland' | 'fallow' | 'degraded' | 'pasture' | 'orchard';
}
```

### 2.2 Feature Matrix

The merged dataset is a 8,769 × 132 matrix:

| Column Range | Count | Source | Description |
|---|---|---|---|
| `cell_id`, `latitude`, `longitude` | 3 | Pipeline | Cell identifiers |
| `MU_GLOBAL` | 1 | HWSD | Mapping unit reference |
| `OC_D1` – `CACO3_D7` | 63 | HWSD v2.0 | 9 attributes × 7 depth layers |
| `A00` – `A63` | 64 | GEE | Satellite embedding dimensions |
| `source` | 1 | Pipeline | Data provenance tag |

### 2.3 Prediction Output

```typescript
interface ReportCell {
  id: number;
  lat: number;
  lon: number;
  baseline_soc: number;            // From HWSD OC_D1
  predicted_soc: number;           // XGBoost prediction
  sequestration_t_co2e_ha: number; // Net carbon credit value
  risk_level: "low" | "moderate" | "high" | "critical";
}
```

---

## 3. ML Pipeline Architecture

### 3.1 Training Flow

```
Dataset/merged_soil_embeddings.csv
         │
         ▼
   ┌─────────────┐
   │ Load & Clean │  ← Filter OC_D1 > 0, drop NaN
   │  (Pandas)    │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Feature Sel. │  ← Select A00–A63 (64 dims)
   │ Target: OC_D1│
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Train/Test   │  ← 80/20 split, seed=42
   │   Split      │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │  XGBoost     │  ← 300 trees, depth=6, lr=0.05
   │  Training    │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │  Evaluate    │  ← R², MAE, RMSE on test set
   │  & Save      │
   └──────┬──────┘
          │
          ├──▶ soc_predictor.json   (model weights)
          └──▶ soc_metrics.json     (evaluation results)
```

### 3.2 Inference Flow

```
Client Request (/api/soc-report)
         │
         ▼
   ┌─────────────┐
   │ Load Data    │  ← BigQuery → Local CSV fallback
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Extract      │  ← A00–A63 feature vectors
   │ Features     │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ XGBoost      │  ← model.predict(embeddings)
   │ Predict      │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Post-Process │  ← SOC → Carbon Stock → CO2e
   │ & Score Risk │     Risk scoring composite
   └──────┬──────┘
          │
          ▼
   JSON Response (summary, top_performers, high_risk_cells)
```

### 3.3 Data Source Resilience

The `SOCPredictor` implements a tiered data source strategy:

1. **BigQuery (Primary)** — Live connection to `clitech-503307.soil_project1.infused_vectors_clean`
2. **Local CSV (Fallback)** — `Dataset/merged_soil_embeddings.csv`
3. **Cached Model (Fast Path)** — `backend/soc_predictor.json` loaded without retraining

This ensures the platform operates in three deployment modes:
- **Cloud-connected** — Full BigQuery integration for latest data
- **Offline/local** — Local CSV for disconnected environments
- **Cache-only** — Pre-trained model for instant startup without data access

---

## 4. Frontend Component Architecture

### 4.1 Layout Hierarchy

```
RootLayout (layout.tsx)
  ├── Font Loading (Source Serif 4, Inter, IBM Plex Mono)
  ├── Global CSS Variables
  └── AppLayout
      ├── Sidebar (persistent, left-aligned)
      │   ├── TERRA Logo
      │   ├── Nav Items (Map, Alerts, Carbon, Enzyme, Reports)
      │   └── System Status Indicators
      ├── TopBar (contextual breadcrumb)
      └── Main Content Area
          └── Page Component (route-specific)
```

### 4.2 Component Inventory

| Component | Type | Renders | Data Source |
|-----------|------|---------|-------------|
| `MapView` | Client | Canvas-based geospatial map | `PilotCell[]` (SSR-injected) |
| `CellDetailPanel` | Client | Slide-in cell inspection | Selected `PilotCell` |
| `AlertCard` | Server | Risk alert directive | `Alert` type |
| `PhotoUploadWidget` | Client | Gemini AI diagnostic UI | `/api/diagnose` |
| `DiagnosisResult` | Client | Diagnosis display | `Diagnosis` type |
| `SocTimeSeriesChart` | Client | Recharts time-series | `/api/carbon/timeseries` |
| `VerificationSummary` | Client | MRV audit docket | Derived from cell data |
| `PollutantForm` | Client | Enzyme design input | `/api/bioremediation` |
| `EnzymeResultCard` | Client | Enzyme result display | `EnzymeDesign` type |
| `IrrigationSchedule` | Server | 7-day water plan table | `IrrigationSlot[]` |
| `Card` / `Badge` / `StatChip` | Shared | Primitive UI elements | Props |

### 4.3 Rendering Strategy

| Route | Rendering | Rationale |
|-------|-----------|-----------|
| `/map` | SSR + Client Hydration | Cell data pre-loaded server-side, canvas rendering client-side |
| `/alerts` | Full SSR | Static alert list, fast first paint |
| `/carbon-portal` | Client-side | Dynamic cell selection requires client state |
| `/enzyme-designer` | SSR Shell + Client Form | Metadata SSR, form interactions client-side |
| `/reports` | Full SSR | Static schedule + report cards |

---

## 5. Security Considerations

| Concern | Current Status | Production Plan |
|---------|---------------|-----------------|
| Authentication | None (MVP) | OAuth 2.0 / Google Sign-In |
| API Rate Limiting | None (MVP) | FastAPI middleware + API keys |
| CORS | Localhost only | Explicit origin allowlist |
| Data Encryption | HTTPS (deployment) | TLS 1.3 + encrypted at rest |
| BigQuery Access | Service account JSON | Workload Identity Federation |
| Input Validation | Pydantic models | Extended validation + sanitization |

---

## 6. Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| Cell rendering (8,769 points) | <16ms per frame | Canvas 2D, no WebGL dependency |
| XGBoost inference (8,348 samples) | ~200ms | Single-threaded prediction |
| Model training (full dataset) | ~5s | 300 trees, 64 features |
| API response (SOC report) | ~500ms | Includes data load + inference |
| Frontend bundle | ~180KB (gzipped) | Next.js code splitting active |
| Dataset size (merged CSV) | 10.2MB | 8,769 rows × 132 columns |

---

*This document is maintained alongside the TERRA codebase and should be updated with each significant architectural change.*
]]>
