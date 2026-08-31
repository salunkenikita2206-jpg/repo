'use client';

import React from 'react';
import { Alert } from '@/lib/types';
import { Badge } from '@/components/ui/Primitives';
import { ArrowRight, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface AlertCardProps {
  alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const borderColors = {
    critical: 'border-l-[#B3261E]',
    moderate: 'border-l-[#E3A008]',
    low: 'border-l-[#2E7D32]',
  };

  const severityBadges = {
    critical: <Badge variant="soil" className="bg-[#B3261E]/10 text-[#B3261E] border-[#B3261E]/30">CRITICAL ACTION</Badge>,
    moderate: <Badge variant="soil" className="bg-[#E3A008]/15 text-[#B47B00] border-[#E3A008]/30">MODERATE WARNING</Badge>,
    low: <Badge variant="soil" className="bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/30">LOW / MAINTENANCE</Badge>,
  };

  const Icons = {
    critical: ShieldAlert,
    moderate: AlertTriangle,
    low: CheckCircle2,
  };

  const Icon = Icons[alert.severity];

  return (
    <div
      className={`bg-white border border-[var(--terra-line)] border-l-4 ${borderColors[alert.severity]} rounded-lg p-5 transition-colors`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          {/* Metadata Row */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            {severityBadges[alert.severity]}
            <span className="text-[var(--terra-ink-muted)]">TARGET CELL:</span>
            <span className="font-semibold text-[var(--terra-ink)] bg-[var(--terra-paper)] px-2 py-0.5 rounded border border-[var(--terra-line)]">
              {alert.cellId}
            </span>
            <span className="text-[var(--terra-ink-muted)] hidden sm:inline">
              XGBoost Confidence: {Math.round(alert.confidence * 100)}%
            </span>
          </div>

          {/* Headline in Serif */}
          <h3 className="font-serif text-lg font-bold text-[var(--terra-ink)] leading-snug">
            {alert.headline}
          </h3>

          {/* Prediction subtext */}
          <p className="text-xs font-sans text-[var(--terra-ink-muted)]">
            <span className="font-semibold text-[var(--terra-ink)]">Ecosystem Prediction: </span>
            {alert.prediction}
          </p>

          {/* Direct Imperative Action */}
          <div className="mt-3 p-3 rounded-lg bg-[var(--terra-paper)] border border-[var(--terra-line)] text-xs text-[var(--terra-ink)] font-mono leading-relaxed">
            <span className="font-semibold text-[var(--terra-forest)] uppercase tracking-wider block mb-1">
              REQUIRED CURE ACTION:
            </span>
            {alert.action}
          </div>
        </div>

        {/* View on Map Button */}
        <div className="shrink-0 flex items-center md:items-start pt-1">
          <Link
            href={`/map?cell=${alert.cellId}`}
            className="inline-flex items-center space-x-2 bg-[var(--terra-forest)] hover:bg-[var(--terra-forest-light)] text-[var(--terra-paper)] px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wide transition-colors"
          >
            <span>VIEW ON MAP</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
