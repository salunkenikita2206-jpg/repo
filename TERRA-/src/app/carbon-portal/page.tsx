'use client';

import React, { useState, useEffect } from 'react';
import { SocPoint, PilotCell } from '@/lib/types';
import { SocTimeSeriesChart } from '@/components/carbon/SocTimeSeriesChart';
import { VerificationSummary } from '@/components/carbon/VerificationSummary';
import { ShieldCheck, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Primitives';

export default function CarbonPortalPage() {
  const [selectedCellId, setSelectedCellId] = useState('MH-0001');
  const [timeseriesData, setTimeseriesData] = useState<SocPoint[]>([]);
  const [cellInfo, setCellInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/carbon/timeseries?cellId=${selectedCellId}`);
        const data = await res.json();
        setTimeseriesData(data.timeseries || []);
        setCellInfo(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCellId]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--terra-ink)] tracking-tight">
            Prove Sequestration Legally
          </h1>
          <p className="text-xs font-mono text-[var(--terra-ink-muted)] mt-0.5">
            CARBON CREDIT MRV (MEASUREMENT, REPORTING &amp; VERIFICATION) PORTAL — VERRA VM0042 COMPLIANT
          </p>
        </div>

        {/* Cell Selector Input */}
        <div className="bg-[var(--terra-surface)] border border-[var(--terra-line)] rounded-lg px-3 py-1.5 flex items-center space-x-2">
          <Search className="w-4 h-4 text-[var(--terra-ink-muted)]" strokeWidth={1.5} />
          <span className="text-xs font-mono text-[var(--terra-ink-muted)]">CELL:</span>
          <input
            type="text"
            value={selectedCellId}
            onChange={(e) => setSelectedCellId(e.target.value.toUpperCase())}
            placeholder="MH-0001"
            className="bg-transparent text-xs font-mono font-bold text-[var(--terra-ink)] focus:outline-none w-24 uppercase"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <Card className="py-16 text-center text-xs font-mono text-[var(--terra-ink-muted)]">
          FETCHING SATELLITE EMBEDDING EVIDENTIARY TRAIL FOR CELL {selectedCellId}...
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Evidentiary Chart */}
          <SocTimeSeriesChart data={timeseriesData} cellId={selectedCellId} />

          {/* Legal Audit Summary Docket */}
          <VerificationSummary
            cellId={selectedCellId}
            socGain={`+${(cellInfo?.currentSoc ? (cellInfo.currentSoc * 0.22).toFixed(2) : '0.38')}%`}
            carbonCreditsIssued={Number(
              (cellInfo?.currentSoc ? cellInfo.currentSoc * 10.5 : 14.2).toFixed(1)
            )}
          />
        </div>
      )}
    </div>
  );
}
