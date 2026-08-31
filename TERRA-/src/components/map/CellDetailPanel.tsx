'use client';

import React from 'react';
import { PilotCell } from '@/lib/types';
import { Card, RiskPill, StatChip, Badge } from '@/components/ui/Primitives';
import { X, ExternalLink, Activity, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

interface CellDetailPanelProps {
  cell: PilotCell | null;
  onClose: () => void;
}

export function CellDetailPanel({ cell, onClose }: CellDetailPanelProps) {
  if (!cell) return null;

  // Mini synthetic sparkline data for SOC history
  const baseSoc = cell.soc_percent;
  const sparklinePoints = [
    { label: 'Q1 2024', val: (baseSoc * 0.85).toFixed(2) },
    { label: 'Q2 2024', val: (baseSoc * 0.90).toFixed(2) },
    { label: 'Q3 2024', val: (baseSoc * 0.94).toFixed(2) },
    { label: 'Q4 2024', val: (baseSoc * 0.97).toFixed(2) },
    { label: 'Current', val: baseSoc.toFixed(2) },
  ];

  return (
    <div className="absolute top-4 right-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] bg-[var(--terra-surface)] border border-[var(--terra-line)] rounded-lg z-20 flex flex-col overflow-hidden shadow-none">
      {/* Header */}
      <div className="p-4 border-b border-[var(--terra-line)] bg-[var(--terra-paper)] flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-mono font-semibold text-[var(--terra-ink-muted)]">
              CELL IDENTIFIER
            </span>
            <Badge variant="soil">{cell.land_use_type.toUpperCase()}</Badge>
          </div>
          <h2 className="text-2xl font-mono font-bold text-[var(--terra-ink)] mt-0.5">
            {cell.cell_id}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded hover:bg-[var(--terra-line)]/50 text-[var(--terra-ink-muted)] hover:text-[var(--terra-ink)] transition-colors"
          aria-label="Close detail panel"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Risk Pill Card */}
        <Card className="p-3 bg-[var(--terra-paper)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[var(--terra-ink-muted)]">
              DEGRADATION RISK
            </span>
            <RiskPill level={cell.degradation_risk} />
          </div>
        </Card>

        {/* Location Readout */}
        <div className="p-3 border border-[var(--terra-line)] rounded-lg bg-white flex justify-between items-center text-xs font-mono">
          <div>
            <span className="text-[var(--terra-ink-muted)] block">LATITUDE</span>
            <span className="font-semibold text-[var(--terra-ink)]">{cell.lat}° N</span>
          </div>
          <div className="h-6 w-px bg-[var(--terra-line)]" />
          <div>
            <span className="text-[var(--terra-ink-muted)] block">LONGITUDE</span>
            <span className="font-semibold text-[var(--terra-ink)]">{cell.lon}° E</span>
          </div>
          <div className="h-6 w-px bg-[var(--terra-line)]" />
          <div>
            <span className="text-[var(--terra-ink-muted)] block">ELEVATION</span>
            <span className="font-semibold text-[var(--terra-ink)]">540m ASL</span>
          </div>
        </div>

        {/* Soil Chemistry Grid */}
        <div>
          <h3 className="text-xs uppercase font-mono tracking-wider text-[var(--terra-ink-muted)] mb-2 font-semibold">
            HWSD v2.0 SOIL CHEMISTRY READOUTS
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <StatChip
              label="SOC CONTENT"
              value={cell.soc_percent}
              unit="%"
              subtext="Soil Organic Carbon"
              variant="soil"
            />
            <StatChip
              label="NITROGEN"
              value={cell.nitrogen_ppm}
              unit="ppm"
              subtext="Available Inorganic N"
            />
            <StatChip
              label="BULK DENSITY"
              value={cell.bulk_density_g_cm3}
              unit="g/cm³"
              subtext="Soil Compaction Index"
              variant={cell.bulk_density_g_cm3 > 1.5 ? 'risk' : 'default'}
            />
            <StatChip
              label="C/N RATIO"
              value={cell.cn_ratio}
              unit=""
              subtext="Decomposition Balance"
            />
          </div>
        </div>

        {/* Mini Sparkline */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-[var(--terra-ink)]">
              <Activity className="w-3.5 h-3.5 text-[var(--terra-forest)]" strokeWidth={1.5} />
              <span>SOC SEQUESTRATION TRAJECTORY</span>
            </div>
            <span className="text-[11px] font-mono text-[var(--terra-ink-muted)]">5 QUARTERS</span>
          </div>
          <div className="h-16 flex items-end justify-between space-x-2 pt-2 border-b border-[var(--terra-line)] pb-1">
            {sparklinePoints.map((pt, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <span className="text-[9px] font-mono text-[var(--terra-ink-muted)] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                  {pt.val}%
                </span>
                <div
                  className="w-full bg-[var(--terra-forest)] rounded-t transition-all"
                  style={{
                    height: `${Math.min(100, Math.max(20, (parseFloat(pt.val) / 3.5) * 100))}%`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] font-mono text-[var(--terra-ink-muted)] mt-1">
            <span>Q1 '24</span>
            <span>Q3 '24</span>
            <span>CURRENT</span>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Link
            href={`/alerts?cell=${cell.cell_id}`}
            className="w-full flex items-center justify-center space-x-2 bg-[var(--terra-forest)] hover:bg-[var(--terra-forest-light)] text-[var(--terra-paper)] py-2.5 px-4 rounded-lg font-medium text-xs tracking-wide transition-colors"
          >
            <Zap className="w-4 h-4 text-emerald-300" strokeWidth={1.5} />
            <span>VIEW ACTION CENTER ALERTS</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto" strokeWidth={1.5} />
          </Link>

          <Link
            href={`/carbon-portal?cell=${cell.cell_id}`}
            className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-[var(--terra-paper)] text-[var(--terra-ink)] border border-[var(--terra-line)] py-2.5 px-4 rounded-lg font-medium text-xs tracking-wide transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[var(--terra-ink-muted)]" strokeWidth={1.5} />
            <span>VERIFY SOC ON CARBON PORTAL</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
