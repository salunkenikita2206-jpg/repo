import { NextResponse } from 'next/server';
import { SocPoint } from '@/lib/types';
import { getCachedPilotCells } from '@/lib/mockData/pilotCoordinates';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cellId = searchParams.get('cellId') || 'MH-0001';

  const cells = getCachedPilotCells();
  const cell = cells.find((c) => c.cell_id.toLowerCase() === cellId.toLowerCase()) || cells[0];

  const baseSoc = cell.soc_percent;

  // Monthly timeline over 24 months (Jan 2024 to Dec 2025)
  const timeseries: SocPoint[] = [
    { date: '2024-01', socPercent: Number((baseSoc * 0.78).toFixed(2)), verified: true },
    { date: '2024-03', socPercent: Number((baseSoc * 0.81).toFixed(2)), verified: true },
    { date: '2024-05', socPercent: Number((baseSoc * 0.83).toFixed(2)), verified: true },
    { date: '2024-07', socPercent: Number((baseSoc * 0.86).toFixed(2)), verified: true },
    { date: '2024-09', socPercent: Number((baseSoc * 0.89).toFixed(2)), verified: true },
    { date: '2024-11', socPercent: Number((baseSoc * 0.92).toFixed(2)), verified: true },
    { date: '2025-01', socPercent: Number((baseSoc * 0.95).toFixed(2)), verified: true },
    { date: '2025-03', socPercent: Number((baseSoc * 0.97).toFixed(2)), verified: true },
    { date: '2025-05', socPercent: Number((baseSoc * 1.00).toFixed(2)), verified: true },
    { date: '2025-07', socPercent: Number((baseSoc * 1.04).toFixed(2)), verified: false },
    { date: '2025-09', socPercent: Number((baseSoc * 1.08).toFixed(2)), verified: false },
    { date: '2025-11', socPercent: Number((baseSoc * 1.12).toFixed(2)), verified: false },
    { date: '2026-01', socPercent: Number((baseSoc * 1.16).toFixed(2)), verified: false },
  ];

  return NextResponse.json({
    cellId: cell.cell_id,
    landUse: cell.land_use_type,
    currentSoc: cell.soc_percent,
    timeseries,
  });
}
