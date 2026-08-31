'use client';

import React from 'react';
import { Diagnosis } from '@/lib/types';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, Badge } from '@/components/ui/Primitives';

interface DiagnosisResultProps {
  diagnosis: Diagnosis;
  onReset: () => void;
}

export function DiagnosisResult({ diagnosis, onReset }: DiagnosisResultProps) {
  return (
    <Card className="border-[var(--terra-ai-accent)] bg-white relative overflow-hidden">
      {/* Top AI Banner */}
      <div className="bg-[var(--terra-ai-accent)] text-white px-4 py-2 -mx-5 -mt-5 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold tracking-wider">
          <Sparkles className="w-4 h-4" strokeWidth={1.5} />
          <span>GEMINI AI ANOMALY DIAGNOSIS</span>
        </div>
        <span className="text-[10px] font-mono opacity-80 uppercase">
          Confidence: {Math.round(diagnosis.confidence * 100)}%
        </span>
      </div>

      <div className="space-y-4">
        {/* Identified Condition */}
        <div>
          <span className="text-xs uppercase font-mono text-[var(--terra-ink-muted)] block mb-1 font-semibold">
            DIAGNOSED CROP / SOIL CONDITION
          </span>
          <h3 className="font-serif text-xl font-bold text-[var(--terra-ink)]">
            {diagnosis.condition}
          </h3>
        </div>

        {/* Linked Soil Factor */}
        <div className="p-3 rounded-lg bg-[var(--terra-paper)] border border-[var(--terra-line)] text-xs font-mono text-[var(--terra-ink)]">
          <div className="flex items-center space-x-1.5 text-[var(--terra-ai-accent)] font-semibold mb-1">
            <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>LINKED HWSD SOIL FACTOR</span>
          </div>
          <p className="text-[var(--terra-ink-muted)]">{diagnosis.linkedSoilFactor}</p>
        </div>

        {/* Recommended Cure */}
        <div className="p-3 rounded-lg bg-[var(--terra-ai-accent)]/10 border border-[var(--terra-ai-accent)]/30 text-xs font-mono text-[var(--terra-ink)]">
          <div className="flex items-center space-x-1.5 text-[var(--terra-ai-accent)] font-semibold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>RECOMMENDED CURE INSTRUCTION</span>
          </div>
          <p className="font-medium text-[var(--terra-ink)]">{diagnosis.recommendedCure}</p>
        </div>

        {/* Reset Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-[var(--terra-ai-accent)] hover:underline font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>DIAGNOSE ANOTHER SAMPLE PHOTO</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
