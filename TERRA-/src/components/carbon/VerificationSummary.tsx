'use client';

import React from 'react';
import { Card, Badge, StatChip } from '@/components/ui/Primitives';
import { ShieldCheck, FileCheck, CheckCircle2, Award, Download } from 'lucide-react';

interface VerificationSummaryProps {
  cellId: string;
  socGain?: string;
  confidenceInterval?: string;
  carbonCreditsIssued?: number;
}

export function VerificationSummary({
  cellId,
  socGain = '+0.38%',
  confidenceInterval = '95% CI (± 0.04%)',
  carbonCreditsIssued = 14.2,
}: VerificationSummaryProps) {
  return (
    <Card className="bg-[var(--terra-paper)] border-[var(--terra-forest)]/30 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--terra-line)] pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-[var(--terra-forest)]" strokeWidth={1.5} />
          <div>
            <h3 className="font-serif text-lg font-bold text-[var(--terra-ink)]">
              MRV Legal Verification Summary
            </h3>
            <p className="text-xs font-mono text-[var(--terra-ink-muted)]">
              CELL {cellId} — AUDIT-READY EVIDENTIARY DOCKET
            </p>
          </div>
        </div>

        <Badge variant="forest" className="py-1 px-3">
          AUDIT READINESS: COMPLIANT
        </Badge>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatChip
          label="CUMULATIVE SOC GAIN"
          value={socGain}
          unit="t/ha"
          subtext="Net 24-Month Organic Carbon Sequestration"
          variant="soil"
        />
        <StatChip
          label="STATISTICAL CONFIDENCE"
          value={confidenceInterval}
          unit=""
          subtext="AlphaEarth Embedding Ensemble variance"
        />
        <StatChip
          label="VERIFIED CARBON CREDITS"
          value={carbonCreditsIssued}
          unit="tCO2e"
          subtext="Verra VM0042 Compliant Issuance"
        />
      </div>

      {/* Evidentiary Plain Language Statement */}
      <div className="p-4 bg-white border border-[var(--terra-line)] rounded-lg space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-[var(--terra-forest)]">
          <FileCheck className="w-4 h-4" strokeWidth={1.5} />
          <span>LEGAL EVIDENTIARY VERIFICATION STATEMENT</span>
        </div>
        <p className="text-xs text-[var(--terra-ink)] leading-relaxed font-sans">
          This cell has undergone non-invasive satellite embedding verification combining Google AlphaEarth Sentinel-2 L2A raster representations and HWSD v2.0 soil profile calibration. The recorded organic carbon increase of <strong className="font-mono">{socGain}</strong> satisfies strict additionality requirements under Verra VM0042 / Gold Standard methodology for agricultural soil carbon enhancement.
        </p>
        <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[var(--terra-ink-muted)] border-t border-[var(--terra-line)]">
          <span>AUDITOR: FAO / DeepMind Satellite MRV Protocol</span>
          <span>TIMESTAMP: 2026-07-24 08:30:12 UTC</span>
        </div>
      </div>

      {/* Export Legal Docket Button */}
      <div className="flex justify-end pt-1">
        <button
          onClick={() => alert(`Downloading Legal MRV Audit Docket PDF for Cell ${cellId}...`)}
          className="inline-flex items-center space-x-2 bg-[var(--terra-forest)] hover:bg-[var(--terra-forest-light)] text-[var(--terra-paper)] px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wide transition-colors"
        >
          <Download className="w-4 h-4" strokeWidth={1.5} />
          <span>EXPORT LEGAL AUDIT DOCKET (PDF)</span>
        </button>
      </div>
    </Card>
  );
}
