import { NextResponse } from 'next/server';
import { getCachedPilotCells } from '@/lib/mockData/pilotCoordinates';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cellId: string }> }
) {
  const { cellId } = await params;
  const cells = getCachedPilotCells();
  const cell = cells.find(
    (c) => c.cell_id.toLowerCase() === cellId.toLowerCase()
  );

  if (!cell) {
    return NextResponse.json(
      { error: `Cell ${cellId} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(cell);
}
