'use client';

import React from 'react';
import { EnzymeDesign } from '@/lib/types';
import { Card, Badge, StatChip } from '@/components/ui/Primitives';
import { Dna, Sparkles, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

interface EnzymeResultCardProps {
  design: EnzymeDesign;
}

export function EnzymeResultCard({ design }: EnzymeResultCardProps) {
  return (
    <Card className="border-[var(--terra-ai-accent)] bg-white space-y-5">
      {/* Top Banner */}
      <div className="bg-[var(--terra-ai-accent)] text-white px-4 py-2.5 -mx-5 -mt-5 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold tracking-wider">
          <Dna className="w-4 h-4" strokeWidth={1.5} />
          <span>ALPHAFOLD 3 BIOREMEDIATION ENZYME SYNTHESIS</span>
        </div>
        <Badge variant="default" className="bg-white text-[var(--terra-ai-accent)] border-transparent font-bold">
          DESIGN VALIDATED
        </Badge>
      </div>

      {/* Main Enzyme Identity Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--terra-line)] pb-4">
        <div>
          <span className="text-xs uppercase font-mono text-[var(--terra-ink-muted)] block font-semibold">
            CATALYTIC ENZYME IDENTIFIER
          </span>
          <h2 className="font-mono text-2xl font-bold text-[var(--terra-ink)] tracking-wider">
            {design.enzymeId}
          </h2>
          <span className="text-xs font-mono text-[var(--terra-ai-accent)] mt-0.5 block">
            Target Pollutant: {design.pollutantType}
          </span>
        </div>

        {/* Large Serif Efficiency Score */}
        <div className="bg-[var(--terra-paper)] border border-[var(--terra-line)] p-4 rounded-lg text-right shrink-0">
          <span className="text-xs uppercase font-mono text-[var(--terra-ink-muted)] block">
            HYDROLYSIS EFFICIENCY
          </span>
          <div className="font-serif text-3xl font-bold text-[var(--terra-forest)] leading-none mt-1">
            {design.efficiencyScore}%
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatChip
          label="ALPHAFOLD 3 pLDDT SCORE"
          value={design.structureConfidence}
          unit="/ 100"
          subtext="High Structural Confidence"
          variant="ai"
        />
        <StatChip
          label="CATALYTIC HALF-LIFE"
          value="48.5"
          unit="hrs"
          subtext="In Soil Matrix Horizon"
        />
        <StatChip
          label="OPTIMAL PH WINDOW"
          value="6.2 – 8.1"
          unit=""
          subtext="Alkaline Clay Tolerant"
        />
      </div>

      {/* Enzyme Synthesis Notes */}
      <div className="p-4 bg-[var(--terra-paper)] border border-[var(--terra-line)] rounded-lg space-y-2">
        <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-[var(--terra-ai-accent)]">
          <Sparkles className="w-4 h-4" strokeWidth={1.5} />
          <span>STRUCTURAL DYNAMICS &amp; DEGRADATION MECHANISM</span>
        </div>
        <p className="text-xs font-mono text-[var(--terra-ink)] leading-relaxed">
          {design.notes}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => alert(`Exporting PDB / FASTA sequence file for ${design.enzymeId}...`)}
          className="inline-flex items-center space-x-2 bg-[var(--terra-ai-accent)] hover:bg-[var(--terra-ai-accent)]/90 text-white px-4 py-2.5 rounded-lg text-xs font-mono font-medium tracking-wide transition-colors"
        >
          <Download className="w-4 h-4" strokeWidth={1.5} />
          <span>EXPORT FASTA / PDB STRUCTURE (.PDB)</span>
        </button>
      </div>
    </Card>
  );
}
