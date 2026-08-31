import { PilotCell, RiskLevel } from '../types';

// Simple fast PRNG for deterministic cell generation
function pseudoRandom(seed: number) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generatePilotCells(): PilotCell[] {
  const cells: PilotCell[] = [];
  const TOTAL_CELLS = 8769;

  const latMin = 19.55;
  const latMax = 20.45;
  const lonMin = 73.75;
  const lonMax = 74.85;

  const latRange = latMax - latMin;
  const lonRange = lonMax - lonMin;

  // Grid dimensions
  const gridRows = Math.floor(Math.sqrt(TOTAL_CELLS));
  const gridCols = Math.ceil(TOTAL_CELLS / gridRows);

  const landUseTypes: PilotCell['land_use_type'][] = [
    'cropland',
    'cropland',
    'cropland',
    'fallow',
    'degraded',
    'pasture',
    'orchard',
  ];

  for (let i = 0; i < TOTAL_CELLS; i++) {
    const row = Math.floor(i / gridCols);
    const col = i % gridCols;

    // Grid position with slight jitter
    const r1 = pseudoRandom(i * 5 + 1);
    const r2 = pseudoRandom(i * 5 + 2);
    const r3 = pseudoRandom(i * 5 + 3);
    const r4 = pseudoRandom(i * 5 + 4);
    const r5 = pseudoRandom(i * 5 + 5);

    const lat = Number((latMin + (row / gridRows) * latRange + (r1 - 0.5) * 0.005).toFixed(4));
    const lon = Number((lonMin + (col / gridCols) * lonRange + (r2 - 0.5) * 0.005).toFixed(4));

    // Soil metrics correlated with geospatial features
    const distFromCenter = Math.sqrt(Math.pow(lat - 20.0, 2) + Math.pow(lon - 74.3, 2));
    
    // SOC percent (0.4% - 3.2%)
    let soc = Number((2.8 - distFromCenter * 3.5 + (r3 - 0.5) * 0.8).toFixed(2));
    if (soc < 0.4) soc = 0.4;
    if (soc > 3.4) soc = 3.4;

    // Degradation risk derived from SOC & synthetic XGBoost scoring
    let risk: RiskLevel = 'low';
    if (soc < 0.8) risk = 'critical';
    else if (soc < 1.3) risk = 'high';
    else if (soc < 1.9) risk = 'moderate';
    else risk = 'low';

    // Nitrogen (ppm) 120 - 450
    const nitrogen = Math.round(140 + soc * 90 + r4 * 80);

    // Bulk density (g/cm3) 1.15 - 1.65 (higher density = worse soil compaction)
    const bulkDensity = Number((1.65 - soc * 0.12 + (r5 - 0.5) * 0.08).toFixed(2));

    // C/N ratio 8.5 - 18.5
    const cnRatio = Number((16.5 - soc * 2.2 + (r1 - 0.5) * 1.5).toFixed(1));

    // Land use index
    const landUse = landUseTypes[Math.floor(r2 * landUseTypes.length)];

    const idNum = (i + 1).toString().padStart(4, '0');
    const cell_id = `MH-${idNum}`;

    cells.push({
      cell_id,
      lat,
      lon,
      soc_percent: soc,
      degradation_risk: risk,
      nitrogen_ppm: nitrogen,
      bulk_density_g_cm3: bulkDensity,
      cn_ratio: cnRatio,
      land_use_type: landUse,
    });
  }

  return cells;
}

// Singleton cache for server performance
let cachedCells: PilotCell[] | null = null;

export function getCachedPilotCells(): PilotCell[] {
  if (!cachedCells) {
    cachedCells = generatePilotCells();
  }
  return cachedCells;
}
