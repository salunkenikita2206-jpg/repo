import { NextResponse } from 'next/server';
import { EnzymeDesign } from '@/lib/types';

export async function POST(request: Request) {
  let pollutantType = 'Polyethylene Microplastics';
  try {
    const body = await request.json();
    if (body.pollutantType && body.pollutantType.trim()) {
      pollutantType = body.pollutantType.trim();
    }
  } catch {
    // fallback default
  }

  const pLower = pollutantType.toLowerCase();

  let enzymeId = 'AF3-ENZ-9402';
  let efficiencyScore = 94.6;
  let structureConfidence = 96.2;
  let notes = 'Engineered PETase mutant with optimized active catalytic cavity (Ser-His-Asp triad) for rapid ester hydrolysis in alkaline clay soil horizons.';

  if (pLower.includes('oil') || pLower.includes('hydrocarbon') || pLower.includes('petroleum')) {
    enzymeId = 'AF3-ENZ-8819';
    efficiencyScore = 91.2;
    structureConfidence = 94.8;
    notes = 'Alkane hydroxylase derivative tailored with hydrophobic substrate tunnel to cleave C10-C24 aliphatic hydrocarbons into bio-assimilable fatty acids.';
  } else if (pLower.includes('heavy metal') || pLower.includes('lead') || pLower.includes('cadmium') || pLower.includes('arsenic')) {
    enzymeId = 'AF3-ENZ-7741';
    efficiencyScore = 88.5;
    structureConfidence = 92.1;
    notes = 'Metallothionein-phytochelatin fusion enzyme displaying high-affinity cysteine-rich binding motifs for heavy metal ion chelation and immobilisation.';
  } else if (pLower.includes('pesticide') || pLower.includes('glyphosate') || pLower.includes('organophosphate')) {
    enzymeId = 'AF3-ENZ-9104';
    efficiencyScore = 96.1;
    structureConfidence = 97.4;
    notes = 'Phosphotriesterase variant optimized for non-toxic hydrolysis of C-P chemical bonds in synthetic organophosphate and glyphosate herbicide residues.';
  }

  const design: EnzymeDesign = {
    enzymeId,
    pollutantType,
    efficiencyScore,
    structureConfidence,
    notes,
  };

  // Add small simulated computational delay
  await new Promise((resolve) => setTimeout(resolve, 650));

  return NextResponse.json(design);
}
