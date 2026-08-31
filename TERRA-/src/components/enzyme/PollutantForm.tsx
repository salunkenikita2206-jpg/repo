'use client';

import React, { useState } from 'react';
import { EnzymeDesign } from '@/lib/types';
import { EnzymeResultCard } from './EnzymeResultCard';
import { Dna, Loader2, Sparkles, Send } from 'lucide-react';
import { Card } from '@/components/ui/Primitives';

export function PollutantForm() {
  const [pollutantType, setPollutantType] = useState('Polyethylene Microplastics');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnzymeDesign | null>(null);

  const presets = [
    'Polyethylene Microplastics',
    'Crude Oil / Petroleum Hydrocarbons',
    'Glyphosate Herbicide Residue',
    'Heavy Metal Ions (Lead / Cadmium)',
    'Organophosphate Pesticides',
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pollutantType.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/bioremediation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollutantType }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Input Card */}
      <Card className="bg-white border-[var(--terra-ai-accent)]/40 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-[var(--terra-ai-accent)]">
          <Dna className="w-4 h-4" strokeWidth={1.5} />
          <span>DE NOVO BIOREMEDIATION ENZYME DESIGNER</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-mono text-[var(--terra-ink-muted)] mb-1 font-semibold">
              SPECIFY SOIL POLLUTANT TYPE
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pollutantType}
                onChange={(e) => setPollutantType(e.target.value)}
                placeholder="e.g. Microplastics, Crude Oil, Glyphosate..."
                className="flex-1 bg-[var(--terra-paper)] border border-[var(--terra-line)] rounded-lg px-4 py-2.5 text-xs font-mono text-[var(--terra-ink)] focus:outline-none focus:border-[var(--terra-ai-accent)]"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-2 bg-[var(--terra-ai-accent)] hover:bg-[var(--terra-ai-accent)]/90 text-white px-5 py-2.5 rounded-lg text-xs font-mono font-medium tracking-wide transition-colors disabled:opacity-50 shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>DESIGN ENZYME</span>
                    <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-mono text-[var(--terra-ink-muted)] block mb-1.5">
              OR SELECT QUICK TARGET COMPOUND PRESET:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setPollutantType(preset)}
                  className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
                    pollutantType === preset
                      ? 'bg-[var(--terra-ai-accent)] text-white border-transparent'
                      : 'bg-[var(--terra-paper)] text-[var(--terra-ink)] border-[var(--terra-line)] hover:border-[var(--terra-ai-accent)]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </form>
      </Card>

      {/* Loading Indicator or Result Card */}
      {loading ? (
        <Card className="py-12 text-center space-y-3 border-[var(--terra-ai-accent)]">
          <Loader2 className="w-8 h-8 mx-auto text-[var(--terra-ai-accent)] animate-spin" />
          <p className="text-xs font-mono font-semibold text-[var(--terra-ink)]">
            SYNTHESIZING ALPHAFOLD 3 ENZYME ATOMIC STRUCTURE...
          </p>
          <p className="text-[11px] font-mono text-[var(--terra-ink-muted)] max-w-sm mx-auto">
            Computing backbone torsion angles and active site docking binding affinity for target: {pollutantType}
          </p>
        </Card>
      ) : (
        result && <EnzymeResultCard design={result} />
      )}
    </div>
  );
}
