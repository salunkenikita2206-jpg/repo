import { NextResponse } from 'next/server';
import { getCachedPilotCells } from '@/lib/mockData/pilotCoordinates';

export async function GET() {
  const cells = getCachedPilotCells();
  return NextResponse.json({
    totalCells: cells.length,
    region: "Nashik / Marathwada, India",
    timestamp: "2026-07-24T06:00:00Z",
    cells,
  });
}
