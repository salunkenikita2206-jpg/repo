import React from 'react';
import { PollutantForm } from '@/components/enzyme/PollutantForm';
import { Dna } from 'lucide-react';

export const metadata = {
  title: 'Enzyme Designer — TERRA Bioremediation Tool',
  description: 'De novo synthetic enzyme design tool for targeted soil contaminant bioremediation using simulated AlphaFold 3 structures.',
};

export default function EnzymeDesignerPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--terra-ink)] tracking-tight">
            Bioremediation Enzyme Designer
          </h1>
          <p className="text-xs font-mono text-[var(--terra-ink-muted)] mt-0.5">
            ALPHAFOLD 3 PROTEIN STRUCTURE GENERATOR — TARGETED CONTAMINANT HYDROLYSIS
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[var(--terra-ai-accent)] bg-white border border-[var(--terra-ai-accent)]/30 px-3 py-1.5 rounded-lg">
          <Dna className="w-4 h-4" strokeWidth={1.5} />
          <span>DE NOVO SYNTHESIS ENGINE</span>
        </div>
      </div>

      {/* Main Bioremediation Tool */}
      <PollutantForm />
    </div>
  );
}
