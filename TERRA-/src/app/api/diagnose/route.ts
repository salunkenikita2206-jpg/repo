import { NextResponse } from 'next/server';
import { Diagnosis } from '@/lib/types';
import { getCachedPilotCells } from '@/lib/mockData/pilotCoordinates';

export async function POST(request: Request) {
  let cellId = 'MH-0042';
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (body.cellId) cellId = body.cellId;
    }
  } catch {
    // fallback default
  }

  const cells = getCachedPilotCells();
  const cell = cells.find((c) => c.cell_id === cellId) || cells[0];

  const diagnosesPool: Partial<Diagnosis>[] = [
    {
      condition: 'Nitrogen chlorosis (early stage foliar yellowing)',
      confidence: 0.94,
      linkedSoilFactor: `Cell ${cell.cell_id}: Nitrogen at ${cell.nitrogen_ppm} ppm (threshold: 350 ppm for active crop canopy), C/N ratio ${cell.cn_ratio}`,
      recommendedCure: 'Apply 45 kg N/ha of controlled-release neem-coated urea combined with Azotobacter bio-fertilizer fertigation.',
    },
    {
      condition: 'Severe compaction-induced root asphyxiation & iron chlorosis',
      confidence: 0.89,
      linkedSoilFactor: `Cell ${cell.cell_id}: Bulk density ${cell.bulk_density_g_cm3} g/cm³ exceeding high-risk threshold (1.50 g/cm³), SOC ${cell.soc_percent}%`,
      recommendedCure: 'Perform subsoil aeration ripping to 35 cm depth and apply foliar chelated iron sulfate (Fe-EDTA at 1.5 g/L).',
    },
    {
      condition: 'Soil organic carbon depletion with fungal wilt vulnerability',
      confidence: 0.92,
      linkedSoilFactor: `Cell ${cell.cell_id}: SOC at ${cell.soc_percent}% (depleted horizon), Bulk density ${cell.bulk_density_g_cm3} g/cm³`,
      recommendedCure: 'Inoculate subsoil with Trichoderma viride bio-fungicide and dress with 5.0 tons/ha enriched vermicompost.',
    },
  ];

  // Pick deterministic diagnosis based on cell_id or random
  const idx = Math.abs(cell.cell_id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % diagnosesPool.length;
  const result = diagnosesPool[idx] as Diagnosis;

  // Add small simulated delay to match real AI inference
  await new Promise((resolve) => setTimeout(resolve, 800));

  return NextResponse.json(result);
}
