'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { SocPoint } from '@/lib/types';
import { Card } from '@/components/ui/Primitives';

interface SocTimeSeriesChartProps {
  data: SocPoint[];
  cellId: string;
}

export function SocTimeSeriesChart({ data, cellId }: SocTimeSeriesChartProps) {
  // Custom Dot renderer to distinguish verified vs predicted points
  const renderDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return null;

    if (payload.verified) {
      return (
        <circle
          key={`dot-${payload.date}`}
          cx={cx}
          cy={cy}
          r={5}
          fill="#0B3D2E"
          stroke="#FFFFFF"
          strokeWidth={2}
        />
      );
    }

    return (
      <circle
        key={`dot-${payload.date}`}
        cx={cx}
        cy={cy}
        r={4}
        fill="#FFFFFF"
        stroke="#C17A3D"
        strokeWidth={2}
        strokeDasharray="2 2"
      />
    );
  };

  return (
    <Card className="bg-white p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--terra-line)] pb-3">
        <div>
          <span className="text-xs uppercase font-mono text-[var(--terra-ink-muted)] block">
            EVIDENTIARY AUDIT TRAIL — CELL {cellId}
          </span>
          <h3 className="font-serif text-lg font-bold text-[var(--terra-ink)]">
            Soil Organic Carbon (SOC %) Multi-Year Sequestration Time Series
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[var(--terra-forest)] border border-white" />
            <span className="text-[var(--terra-ink)]">Verified HWSD v2.0 In-Situ Ground Truth</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-white border border-[var(--terra-soil)]" />
            <span className="text-[var(--terra-ink-muted)]">AlphaEarth Satellite Prediction</span>
          </div>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4DFD3" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#5B6560"
              fontSize={11}
              fontFamily="IBM Plex Mono"
              tickLine={false}
            />
            <YAxis
              stroke="#5B6560"
              fontSize={11}
              fontFamily="IBM Plex Mono"
              domain={['auto', 'auto']}
              unit="%"
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as SocPoint;
                  return (
                    <div className="bg-white border border-[var(--terra-line)] p-2.5 rounded-lg shadow-none font-mono text-xs space-y-1">
                      <div className="text-[var(--terra-ink-muted)] border-b border-[var(--terra-line)] pb-1">
                        DATE: {pt.date}
                      </div>
                      <div className="text-[var(--terra-ink)] font-bold">
                        SOC: {pt.socPercent}%
                      </div>
                      <div
                        className={
                          pt.verified ? 'text-[var(--terra-forest)] font-semibold' : 'text-[var(--terra-soil)]'
                        }
                      >
                        {pt.verified ? '✓ VERIFIED AUDIT POINT' : '• PREDICTED / EMBEDDING'}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={1.5} stroke="#E3A008" strokeDasharray="4 4" label={{ value: '1.5% Minimum Threshold', fill: '#B47B00', fontSize: 10, position: 'insideTopLeft' }} />
            <Line
              type="monotone"
              dataKey="socPercent"
              stroke="#0B3D2E"
              strokeWidth={2.5}
              dot={renderDot}
              activeDot={{ r: 7, fill: '#0B3D2E' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] font-mono text-[var(--terra-ink-muted)] bg-[var(--terra-paper)] p-2.5 rounded border border-[var(--terra-line)]">
        * Solid dark nodes represent verified ISO-14064 ground truth samples. Hollow nodes represent AlphaEarth Sentinel-2 L2A high-resolution spectral predictions.
      </div>
    </Card>
  );
}
