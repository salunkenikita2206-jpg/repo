import React from 'react';
import { IrrigationSlot } from '@/lib/types';
import { IrrigationSchedule } from '@/components/optimizer/IrrigationSchedule';
import { Card, Badge, StatChip } from '@/components/ui/Primitives';
import { FileBarChart, Download, CheckCircle2, ShieldCheck, Leaf } from 'lucide-react';

export const metadata = {
  title: 'Resource Optimizer — TERRA Environmental Intelligence',
  description: 'AlphaEvolve-style precision resource optimizer and exportable executive agronomic summaries.',
};

async function getIrrigationSchedule(): Promise<IrrigationSlot[]> {
  const res = await fetch('http://localhost:3000/api/optimizer/irrigation', { cache: 'no-store' }).catch(() => null);
  if (res && res.ok) {
    return res.json();
  }
  return [
    {
      day: 'Monday',
      cellIds: ['MH-0001', 'MH-0002', 'MH-0014', 'MH-0042'],
      litersPerHectare: 4200,
      window: '05:30 AM - 07:45 AM (Low Evaporative Deficit)',
    },
    {
      day: 'Tuesday',
      cellIds: ['MH-0102', 'MH-0105', 'MH-0189', 'MH-0204'],
      litersPerHectare: 3800,
      window: '06:00 AM - 08:15 AM (Thermal Inversion Window)',
    },
    {
      day: 'Wednesday',
      cellIds: ['MH-0310', 'MH-0412', 'MH-0550'],
      litersPerHectare: 5100,
      window: '05:00 AM - 07:30 AM (Deep Root Saturation)',
    },
    {
      day: 'Thursday',
      cellIds: ['MH-0890', 'MH-0912', 'MH-1094', 'MH-1200'],
      litersPerHectare: 3500,
      window: '06:15 AM - 08:30 AM (Pulse Fertigation Cycle)',
    },
    {
      day: 'Friday',
      cellIds: ['MH-1420', 'MH-1600', 'MH-1845'],
      litersPerHectare: 4600,
      window: '05:30 AM - 08:00 AM (Sub-surface Drip Dosing)',
    },
    {
      day: 'Saturday',
      cellIds: ['MH-2100', 'MH-2405', 'MH-2801'],
      litersPerHectare: 3200,
      window: '06:00 AM - 07:45 AM (Maintenance Flush)',
    },
    {
      day: 'Sunday',
      cellIds: ['MH-3140', 'MH-3500', 'MH-4509'],
      litersPerHectare: 2900,
      window: '06:30 AM - 08:00 AM (Soil Aeration Pause)',
    },
  ];
}

export default async function ReportsPage() {
  const schedule = await getIrrigationSchedule();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--terra-ink)] tracking-tight">
            Resource Optimizer &amp; Executive Reports
          </h1>
          <p className="text-xs font-mono text-[var(--terra-ink-muted)] mt-0.5">
            ALPHAEVOLVE PRECISION RESOURCE ALLOCATION &amp; FAO AUDIT SUMMARIES
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="inline-flex items-center space-x-2 bg-[var(--terra-forest)] hover:bg-[var(--terra-forest-light)] text-[var(--terra-paper)] px-4 py-2 rounded-lg text-xs font-mono font-medium transition-colors"
          >
            <Download className="w-4 h-4" strokeWidth={1.5} />
            <span>EXPORT EXECUTIVE REPORT (PDF)</span>
          </button>
        </div>
      </div>

      {/* AlphaEvolve Irrigation Schedule Component */}
      <IrrigationSchedule schedule={schedule} />

      {/* Executive Report Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Agronomic Summary Card */}
        <Card className="bg-white space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-[var(--terra-forest)]">
            <Leaf className="w-4 h-4" strokeWidth={1.5} />
            <span>NITROGEN USE EFFICIENCY (NUE) AUDIT</span>
          </div>
          <p className="text-xs text-[var(--terra-ink)] font-sans leading-relaxed">
            Satellite hyperspectral analysis indicates a 22.4% increase in nitrogen uptake efficiency across Nashik pilot blocks following split micro-drip fertigation protocols. Inorganic nitrogen leaching was reduced by 140 kg N/ha season-over-season.
          </p>
          <div className="pt-2 flex justify-between text-[11px] font-mono text-[var(--terra-ink-muted)] border-t border-[var(--terra-line)]">
            <span>METHODOLOGY: HWSD v2.0 Nitrogen Mass Balance</span>
            <span className="text-[var(--terra-forest)] font-bold">STATUS: OPTIMAL</span>
          </div>
        </Card>

        {/* SOC Sequestration Summary Card */}
        <Card className="bg-white space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-[var(--terra-soil)]">
            <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
            <span>REGIONAL SOC ACCUMULATION DOCKET</span>
          </div>
          <p className="text-xs text-[var(--terra-ink)] font-sans leading-relaxed">
            Cumulative organic carbon sequestration across the 8,769 cell pilot grid stands at <strong className="font-mono">3,410.5 metric tons CO2e</strong>. 91.4% of cropland cells demonstrate positive organic carbon trajectory under zero-till biochar interventions.
          </p>
          <div className="pt-2 flex justify-between text-[11px] font-mono text-[var(--terra-ink-muted)] border-t border-[var(--terra-line)]">
            <span>ISO-14064 VERIFIED</span>
            <span className="text-[var(--terra-soil)] font-bold">AUDIT READY</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
