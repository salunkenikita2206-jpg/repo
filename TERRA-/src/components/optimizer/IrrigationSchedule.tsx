'use client';

import React from 'react';
import { IrrigationSlot } from '@/lib/types';
import { Card, Badge, StatChip } from '@/components/ui/Primitives';
import { Droplets, Calendar, Clock, Download, FileSpreadsheet, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface IrrigationScheduleProps {
  schedule: IrrigationSlot[];
}

export function IrrigationSchedule({ schedule }: IrrigationScheduleProps) {
  return (
    <Card className="bg-white p-5 space-y-5">
      {/* Table Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--terra-line)] pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded bg-[var(--terra-paper)] text-[var(--terra-forest)] border border-[var(--terra-line)]">
            <Droplets className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[var(--terra-ink)]">
              AlphaEvolve Weekly Precision Irrigation Schedule
            </h3>
            <p className="text-xs font-mono text-[var(--terra-ink-muted)]">
              OPTIMIZED TO PREVENT RUNOFF &amp; EVAPORATIVE DEFICITS
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => alert('Exporting Irrigation Schedule CSV...')}
            className="inline-flex items-center space-x-1.5 bg-white border border-[var(--terra-line)] text-[var(--terra-ink)] hover:bg-[var(--terra-paper)] px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[var(--terra-forest)]" strokeWidth={1.5} />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatChip
          label="WEEKLY WATER ALLOCATION"
          value="27,300"
          unit="L/ha"
          subtext="AlphaEvolve Dynamic Cap"
          variant="soil"
        />
        <StatChip
          label="ESTIMATED WATER SAVED"
          value="18.4%"
          unit=""
          subtext="Vs Conventional Flood Irrigation"
        />
        <StatChip
          label="OPTIMAL EVAPORATION WINDOW"
          value="05:30 – 08:30"
          unit="AM"
          subtext="Minimal Evaporative Deficit"
        />
      </div>

      {/* Weekly Schedule Table */}
      <div className="overflow-x-auto border border-[var(--terra-line)] rounded-lg">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[var(--terra-paper)] border-b border-[var(--terra-line)] text-[var(--terra-ink-muted)] uppercase">
            <tr>
              <th className="py-3 px-4 font-semibold">DAY</th>
              <th className="py-3 px-4 font-semibold">TARGET CELL BLOCK</th>
              <th className="py-3 px-4 font-semibold">DOSING RATE (L/HA)</th>
              <th className="py-3 px-4 font-semibold">OPTIMAL WINDOW</th>
              <th className="py-3 px-4 font-semibold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--terra-line)] bg-white">
            {schedule.map((slot, index) => (
              <tr key={slot.day} className="hover:bg-[var(--terra-paper)]/50 transition-colors">
                <td className="py-3 px-4 font-bold text-[var(--terra-ink)] flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[var(--terra-forest)]" strokeWidth={1.5} />
                  <span>{slot.day}</span>
                </td>

                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {slot.cellIds.map((cId) => (
                      <Link
                        key={cId}
                        href={`/map?cell=${cId}`}
                        className="bg-[var(--terra-paper)] hover:bg-[var(--terra-line)] text-[var(--terra-ink)] border border-[var(--terra-line)] px-1.5 py-0.5 rounded text-[11px] font-semibold"
                      >
                        {cId}
                      </Link>
                    ))}
                  </div>
                </td>

                <td className="py-3 px-4 font-bold text-[var(--terra-forest)]">
                  {slot.litersPerHectare.toLocaleString()} L/ha
                </td>

                <td className="py-3 px-4 text-[var(--terra-ink-muted)]">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-[var(--terra-soil)]" strokeWidth={1.5} />
                    <span>{slot.window}</span>
                  </div>
                </td>

                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/map?cell=${slot.cellIds[0]}`}
                    className="inline-flex items-center space-x-1 text-[var(--terra-forest)] hover:underline font-semibold"
                  >
                    <span>VIEW ZONE</span>
                    <ArrowUpRight className="w-3 h-3" strokeWidth={1.5} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
