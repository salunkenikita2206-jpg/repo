import { NextResponse } from 'next/server';
import { Alert } from '@/lib/types';

export async function GET() {
  const alerts: Alert[] = [
    {
      id: 'ALT-0104',
      cellId: 'MH-0042',
      severity: 'critical',
      headline: 'Inject Biochar and Rotate to Legume Cover Crops Immediately',
      prediction: 'to prevent 18.4% SOC depletion and structural soil collapse over the next 90 days',
      confidence: 0.94,
      action: 'Apply 4.5 tons/ha hardwood biochar combined with Cajanus cajan (pigeon pea) cover cropping before rain onset.',
    },
    {
      id: 'ALT-0108',
      cellId: 'MH-0189',
      severity: 'critical',
      headline: 'Halt Deep Tillage in Severely Compounded Fallow Block',
      prediction: 'to halt accelerated mineralization leading to 240 ppm nitrogen volatilization',
      confidence: 0.91,
      action: 'Transition immediately to zero-till disk seeding and apply surface wheat straw mulch at 3.0 tons/ha.',
    },
    {
      id: 'ALT-0211',
      cellId: 'MH-0412',
      severity: 'critical',
      headline: 'Remediate Sodic Horizon with Calcium Sulfate Dosing',
      prediction: 'to avert 14.2% bulk density increase and severe water infiltration blockages by Q4',
      confidence: 0.89,
      action: 'Broadcast 2.2 tons/ha agricultural gypsum followed by light targeted drip irrigation.',
    },
    {
      id: 'ALT-0305',
      cellId: 'MH-1094',
      severity: 'moderate',
      headline: 'Adjust Micro-Drip Irrigation Frequency to Prevent Nitrate Leaching',
      prediction: 'to reduce 8.5% nitrogen run-off into subsoil water tables during monsoon prep',
      confidence: 0.86,
      action: 'Split daily drip schedule into three 45-minute pulse cycles with low-dose liquid bio-fertilizer.',
    },
    {
      id: 'ALT-0312',
      cellId: 'MH-1420',
      severity: 'moderate',
      headline: 'Inoculate Cropland with Mycorrhizal Fungi Consortium',
      prediction: 'to boost phosphorus availability and stem 6.2% organic carbon oxidation',
      confidence: 0.83,
      action: 'Apply Arbuscular Mycorrhizal Fungi spore inoculants via fertigation lines during seedling root formation.',
    },
    {
      id: 'ALT-0402',
      cellId: 'MH-2801',
      severity: 'moderate',
      headline: 'Establish Permanent Grass Contour Strips Along Slope Boundaries',
      prediction: 'to prevent topsoil erosion exceeding 4.1 tons/ha during high-intensity convective rainfall',
      confidence: 0.81,
      action: 'Plant Vetiver (Chrysopogon zizanioides) hedgerows along 2% topographic contour lines.',
    },
    {
      id: 'ALT-0501',
      cellId: 'MH-3140',
      severity: 'low',
      headline: 'Maintain Current Zero-Till Biochar Regimen',
      prediction: 'to maintain steady 0.08% quarterly SOC accumulation through post-harvest cycle',
      confidence: 0.96,
      action: 'Maintain existing crop residue retention strategy and conduct routine satellite embedding re-sync in 30 days.',
    },
    {
      id: 'ALT-0509',
      cellId: 'MH-4509',
      severity: 'low',
      headline: 'Schedule Mid-Season Foliar Micronutrient Spray',
      prediction: 'to optimize photosynthetic carbon capture efficiency across active onion canopy',
      confidence: 0.88,
      action: 'Apply chelated zinc and iron foliar mix at 0.5 kg/ha under overcast early morning conditions.',
    },
  ];

  return NextResponse.json(alerts);
}
