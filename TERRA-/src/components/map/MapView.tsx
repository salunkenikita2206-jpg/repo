'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PilotCell, RiskLevel } from '@/lib/types';
import { CellDetailPanel } from './CellDetailPanel';
import { Layers, Flame, AlertTriangle, RefreshCw, ZoomIn, ZoomOut, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Primitives';

interface MapViewProps {
  cells: PilotCell[];
  selectedCellId?: string | null;
}

export type OverlayMode = 'soc' | 'risk';

export function MapView({ cells, selectedCellId }: MapViewProps) {
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('soc');
  const [selectedCell, setSelectedCell] = useState<PilotCell | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewState, setViewState] = useState({
    lat: 20.0,
    lon: 74.3,
    zoom: 9.2,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sync initial or passed selectedCellId
  useEffect(() => {
    if (selectedCellId && cells.length > 0) {
      const found = cells.find(
        (c) => c.cell_id.toLowerCase() === selectedCellId.toLowerCase()
      );
      if (found) setSelectedCell(found);
    }
  }, [selectedCellId, cells]);

  // Filter cells based on search & risk filter
  const filteredCells = useMemo(() => {
    return cells.filter((c) => {
      if (filterRisk !== 'all' && c.degradation_risk !== filterRisk) return false;
      if (searchTerm && !c.cell_id.toLowerCase().includes(searchTerm.toLowerCase()))
        return false;
      return true;
    });
  }, [cells, filterRisk, searchTerm]);

  // Helper color mappings
  const getSocColor = (soc: number) => {
    if (soc < 0.8) return '#F4E8C1'; // terra-soc-1
    if (soc < 1.4) return '#C8D5A9'; // terra-soc-2
    if (soc < 2.0) return '#8FB596'; // terra-soc-3
    if (soc < 2.6) return '#4F8F6E'; // terra-soc-4
    return '#1B4332'; // terra-soc-5
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical':
        return '#B3261E'; // terra-risk-critical
      case 'high':
        return '#B3261E';
      case 'moderate':
        return '#E3A008'; // terra-risk-moderate
      case 'low':
      default:
        return '#2E7D32'; // terra-risk-healthy
    }
  };

  // Canvas high-performance geospatial renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with paper background tone
    ctx.fillStyle = '#EBE7DC';
    ctx.fillRect(0, 0, width, height);

    // Draw background grid lines (latitude/longitude guidelines)
    ctx.strokeStyle = '#D9D3C5';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Map bounds
    const latMin = 19.55;
    const latMax = 20.45;
    const lonMin = 73.75;
    const lonMax = 74.85;

    // Coordinate conversion
    const latToY = (lat: number) => {
      const norm = (latMax - lat) / (latMax - latMin);
      return (norm - 0.5) * Math.pow(2, viewState.zoom - 9) * height + height / 2;
    };

    const lonToX = (lon: number) => {
      const norm = (lon - lonMin) / (lonMax - lonMin);
      return (norm - 0.5) * Math.pow(2, viewState.zoom - 9) * width + width / 2;
    };

    // Render cells
    const pointRadius = Math.max(1.8, (viewState.zoom - 6) * 1.2);

    filteredCells.forEach((cell) => {
      const x = lonToX(cell.lon);
      const y = latToY(cell.lat);

      if (x < -10 || x > width + 10 || y < -10 || y > height + 10) return;

      const isSelected = selectedCell?.cell_id === cell.cell_id;
      const color =
        overlayMode === 'soc'
          ? getSocColor(cell.soc_percent)
          : getRiskColor(cell.degradation_risk);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, isSelected ? pointRadius * 2.2 : pointRadius, 0, Math.PI * 2);
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = '#14181A';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw compass / scale text in bottom left
    ctx.fillStyle = '#5B6560';
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.fillText(
      `GRID SCALE: 1:25,000 | LAT ${viewState.lat.toFixed(2)}° N, LON ${viewState.lon.toFixed(2)}° E`,
      16,
      height - 16
    );
  }, [filteredCells, overlayMode, selectedCell, viewState]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle Canvas Click to select nearest cell
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;

    const latMin = 19.55;
    const latMax = 20.45;
    const lonMin = 73.75;
    const lonMax = 74.85;

    const latToY = (lat: number) => {
      const norm = (latMax - lat) / (latMax - latMin);
      return (norm - 0.5) * Math.pow(2, viewState.zoom - 9) * height + height / 2;
    };

    const lonToX = (lon: number) => {
      const norm = (lon - lonMin) / (lonMax - lonMin);
      return (norm - 0.5) * Math.pow(2, viewState.zoom - 9) * width + width / 2;
    };

    let closestCell: PilotCell | null = null;
    let minDistance = 25; // 25px click threshold

    filteredCells.forEach((cell) => {
      const x = lonToX(cell.lon);
      const y = latToY(cell.lat);
      const dist = Math.sqrt(Math.pow(clickX - x, 2) + Math.pow(clickY - y, 2));
      if (dist < minDistance) {
        minDistance = dist;
        closestCell = cell;
      }
    });

    setSelectedCell(closestCell);
  };

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] rounded-lg overflow-hidden border border-[var(--terra-line)] bg-[var(--terra-paper)]">
      {/* Canvas Map Surface */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair block"
      />

      {/* Top Left Search & Filter Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex flex-col sm:flex-row gap-2 max-w-lg">
        {/* Search input */}
        <div className="bg-[var(--terra-surface)] border border-[var(--terra-line)] rounded-lg px-3 py-1.5 flex items-center shadow-none">
          <span className="text-xs font-mono text-[var(--terra-ink-muted)] mr-2">FIND CELL:</span>
          <input
            type="text"
            placeholder="MH-0042..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-mono text-[var(--terra-ink)] focus:outline-none w-28"
          />
        </div>

        {/* Risk dropdown */}
        <div className="bg-[var(--terra-surface)] border border-[var(--terra-line)] rounded-lg px-2.5 py-1.5 flex items-center shadow-none">
          <Filter className="w-3.5 h-3.5 text-[var(--terra-ink-muted)] mr-1.5" strokeWidth={1.5} />
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-transparent text-xs font-mono text-[var(--terra-ink)] focus:outline-none cursor-pointer"
          >
            <option value="all">ALL RISKS</option>
            <option value="critical">CRITICAL ONLY</option>
            <option value="high">HIGH ONLY</option>
            <option value="moderate">MODERATE ONLY</option>
            <option value="low">HEALTHY / LOW</option>
          </select>
        </div>
      </div>

      {/* Top Right Overlay Layer Switcher */}
      <div className="absolute top-4 right-4 z-10 bg-[var(--terra-surface)] border border-[var(--terra-line)] rounded-lg p-1.5 flex space-x-1 shadow-none">
        <button
          onClick={() => setOverlayMode('soc')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
            overlayMode === 'soc'
              ? 'bg-[var(--terra-forest)] text-[var(--terra-paper)]'
              : 'text-[var(--terra-ink-muted)] hover:text-[var(--terra-ink)] hover:bg-[var(--terra-paper)]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>SOC HEATMAP</span>
        </button>

        <button
          onClick={() => setOverlayMode('risk')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
            overlayMode === 'risk'
              ? 'bg-[var(--terra-forest)] text-[var(--terra-paper)]'
              : 'text-[var(--terra-ink-muted)] hover:text-[var(--terra-ink)] hover:bg-[var(--terra-paper)]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>DEGRADATION RISK</span>
        </button>
      </div>

      {/* Bottom Right Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-1">
        <button
          onClick={() => setViewState((v) => ({ ...v, zoom: Math.min(12, v.zoom + 0.5) }))}
          className="p-2 bg-[var(--terra-surface)] border border-[var(--terra-line)] rounded-lg text-[var(--terra-ink)] hover:bg-[var(--terra-paper)]"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => setViewState((v) => ({ ...v, zoom: Math.max(7, v.zoom - 0.5) }))}
          className="p-2 bg-[var(--terra-surface)] border border-[var(--terra-line)] rounded-lg text-[var(--terra-ink)] hover:bg-[var(--terra-paper)]"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Legend Box (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 bg-[var(--terra-surface)] border border-[var(--terra-line)] rounded-lg p-3 max-w-xs shadow-none">
        <div className="flex items-center justify-between text-xs font-mono font-semibold text-[var(--terra-ink)] mb-2">
          <span>{overlayMode === 'soc' ? 'SOC CARBON INDEX' : 'RISK CLASSIFICATION'}</span>
          <span className="text-[10px] text-[var(--terra-ink-muted)]">HWSD v2.0</span>
        </div>

        {overlayMode === 'soc' ? (
          <div className="space-y-1">
            <div className="h-3 w-full rounded flex overflow-hidden">
              <div className="flex-1 bg-[#F4E8C1]" />
              <div className="flex-1 bg-[#C8D5A9]" />
              <div className="flex-1 bg-[#8FB596]" />
              <div className="flex-1 bg-[#4F8F6E]" />
              <div className="flex-1 bg-[#1B4332]" />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[var(--terra-ink-muted)]">
              <span>0.4% (Depleted)</span>
              <span>1.8%</span>
              <span>3.4% (Thriving)</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B3261E]" />
              <span>Critical</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E3A008]" />
              <span>Moderate</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
              <span>Healthy</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Slide-in Detail Panel */}
      <CellDetailPanel
        cell={selectedCell}
        onClose={() => setSelectedCell(null)}
      />
    </div>
  );
}
