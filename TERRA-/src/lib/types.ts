export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface PilotCell {
  cell_id: string; // e.g. "MH-0001"
  lat: number;
  lon: number;
  soc_percent: number; // e.g. 1.42
  degradation_risk: RiskLevel;
  nitrogen_ppm: number; // e.g. 320
  bulk_density_g_cm3: number; // e.g. 1.38
  cn_ratio: number; // e.g. 11.2
  land_use_type: 'cropland' | 'fallow' | 'degraded' | 'pasture' | 'orchard';
}

export type Alert = {
  id: string;
  cellId: string;
  severity: 'critical' | 'moderate' | 'low';
  headline: string;        // e.g. "Rotate to Cover Crops now"
  prediction: string;      // e.g. "to prevent 15% SOC loss over 90 days"
  confidence: number;      // 0-1, from XGBoost predictor
  action: string;          // single imperative sentence, no charts
};

export type Diagnosis = {
  condition: string;         // e.g. "Nitrogen deficiency, early stage"
  confidence: number;        // 0-1
  linkedSoilFactor: string;  // e.g. "Cell MH-0042: nitrogen 180ppm, below cropland threshold"
  recommendedCure: string;   // single direct instruction
};

export type SocPoint = {
  date: string;
  socPercent: number;
  verified: boolean;
};

export type EnzymeDesign = {
  enzymeId: string;
  pollutantType: string;
  efficiencyScore: number;     // 0-100
  structureConfidence: number; // simulated AlphaFold 3 pLDDT-style score
  notes: string;
};

export type IrrigationSlot = {
  day: string;
  cellIds: string[];
  litersPerHectare: number;
  window: string;
};

export type NavDestination = 'map' | 'alerts' | 'carbon-portal' | 'enzyme-designer' | 'reports';
