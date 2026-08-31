import { getCachedPilotCells } from '@/lib/mockData/pilotCoordinates';
import { MapView } from '@/components/map/MapView';

export const metadata = {
  title: 'Geospatial Dashboard — TERRA Environmental Intelligence',
  description: 'Planet-scale precision farming map displaying SOC heatmap and degradation risk across 8,769 pilot cells.',
};

export default function MapPage({
  searchParams,
}: {
  searchParams?: { cell?: string };
}) {
  const cells = getCachedPilotCells();
  const selectedCellId = searchParams?.cell || null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--terra-ink)] tracking-tight">
            Geospatial Dashboard
          </h1>
          <p className="text-xs font-mono text-[var(--terra-ink-muted)] mt-0.5">
            ALPHAEARTH SATELLITE EMBEDDINGS &amp; HWSD v2.0 RASTER OVERLAYS
          </p>
        </div>
      </div>

      <MapView cells={cells} selectedCellId={selectedCellId} />
    </div>
  );
}
