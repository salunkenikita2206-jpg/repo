/**
 * Client API services for communicating with the TERRA FastAPI backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface BigQueryStatus {
  auth_ok: boolean;
  message: string;
  project_id: string;
  table_name: string;
  data_source: string;
}

export interface ModelMetrics {
  r2: number;
  mae: number;
  rmse: number;
  data_source: string;
  trained_rows?: number;
  features_used?: number;
}

export interface ReportCell {
  id: number;
  lat: number;
  lon: number;
  baseline_soc: number;
  predicted_soc: number;
  sequestration_t_co2e_ha: number;
  risk_level: "low" | "moderate" | "high" | "critical";
}

export interface SocReport {
  summary: {
    total_cells: number;
    total_area_ha: number;
    baseline_mean_soc: number;
    predicted_mean_soc: number;
    net_sequestration_mean_t_co2e_ha: number;
    total_sequestration_t_co2e: number;
    verification_status: string;
  };
  metrics: ModelMetrics;
  top_performers: ReportCell[];
  high_risk_cells: ReportCell[];
}

/**
 * Checks the Google BigQuery authentication status from the backend.
 */
export async function getBigQueryStatus(): Promise<BigQueryStatus> {
  const res = await fetch(`${API_BASE}/api/bigquery-status`);
  if (!res.ok) {
    throw new Error(`Failed to fetch BigQuery status: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Triggers manual retraining of the XGBoost model in the backend.
 */
export async function trainModel(): Promise<{ status: string; metrics: ModelMetrics }> {
  const res = await fetch(`${API_BASE}/api/train-model`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`Failed to retrain model: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Retrieves the compiled Soil Organic Carbon (SOC) report generated from XGBoost predictions.
 */
export async function getSocReport(): Promise<SocReport> {
  const res = await fetch(`${API_BASE}/api/soc-report`);
  if (!res.ok) {
    throw new Error(`Failed to generate SOC report: ${res.statusText}`);
  }
  return res.json();
}
