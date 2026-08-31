'use client';

import React, { useState } from 'react';
import { Diagnosis } from '@/lib/types';
import { DiagnosisResult } from './DiagnosisResult';
import { Upload, Camera, Sparkles, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Primitives';

interface PhotoUploadWidgetProps {
  targetCellId?: string;
}

export function PhotoUploadWidget({ targetCellId = 'MH-0042' }: PhotoUploadWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (file?: File) => {
    setLoading(true);
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cellId: targetCellId }),
      });
      const data = await res.json();
      setDiagnosis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (diagnosis) {
    return <DiagnosisResult diagnosis={diagnosis} onReset={() => setDiagnosis(null)} />;
  }

  return (
    <Card className="border-[var(--terra-ai-accent)]/40 bg-white">
      <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-[var(--terra-ai-accent)] mb-3">
        <Sparkles className="w-4 h-4" strokeWidth={1.5} />
        <span>GEMINI AI CROP ANOMALY DIAGNOSTIC</span>
      </div>

      {loading ? (
        <div className="py-10 text-center space-y-3">
          <Loader2 className="w-8 h-8 mx-auto text-[var(--terra-ai-accent)] animate-spin" />
          <p className="text-xs font-mono text-[var(--terra-ink)]">
            ANALYZING IMAGE AGAINST HWSD SOIL CHEMISTRY...
          </p>
          <p className="text-[11px] font-mono text-[var(--terra-ink-muted)]">
            Correlating foliar RGB spectral pattern with Cell {targetCellId}
          </p>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
          }}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-[var(--terra-ai-accent)] bg-[var(--terra-ai-accent)]/5'
              : 'border-[var(--terra-line)] hover:border-[var(--terra-ai-accent)]/50 bg-[var(--terra-paper)]'
          }`}
        >
          <div className="w-10 h-10 mx-auto rounded-full bg-white border border-[var(--terra-line)] flex items-center justify-center text-[var(--terra-ai-accent)] mb-3">
            <Upload className="w-5 h-5" strokeWidth={1.5} />
          </div>

          <h4 className="font-serif text-base font-bold text-[var(--terra-ink)] mb-1">
            Upload Field Leaf / Soil Photo
          </h4>
          <p className="text-xs text-[var(--terra-ink-muted)] font-sans max-w-sm mx-auto mb-4">
            Upload a high-resolution field leaf crop image to instantly diagnose nutritional deficiencies against cell soil chemistry.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <label className="cursor-pointer inline-flex items-center space-x-2 bg-[var(--terra-ai-accent)] hover:bg-[var(--terra-ai-accent)]/90 text-white px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wide transition-colors">
              <Upload className="w-4 h-4" strokeWidth={1.5} />
              <span>SELECT FILE</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
            </label>

            <label className="cursor-pointer inline-flex items-center space-x-2 bg-white border border-[var(--terra-line)] text-[var(--terra-ink)] hover:bg-[var(--terra-paper)] px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wide transition-colors">
              <Camera className="w-4 h-4 text-[var(--terra-ink-muted)]" strokeWidth={1.5} />
              <span>TAKE PHOTO (CAMERA)</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      )}
    </Card>
  );
}
