'use client';

import React from 'react';
import { Menu, Globe, Layers, Clock } from 'lucide-react';

interface TopBarProps {
  onMobileMenuToggle?: () => void;
}

export function TopBar({ onMobileMenuToggle }: TopBarProps) {
  return (
    <header className="h-14 bg-[var(--terra-surface)] border-b border-[var(--terra-line)] px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-1.5 rounded hover:bg-[var(--terra-paper)] text-[var(--terra-ink)]"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-[var(--terra-soil)]" strokeWidth={1.5} />
          <span className="text-xs uppercase tracking-wider font-semibold font-mono text-[var(--terra-ink)]">
            PILOT REGION: Nashik / Marathwada, India
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-1.5 bg-[var(--terra-paper)] border border-[var(--terra-line)] px-2.5 py-1 rounded text-xs font-mono">
          <Layers className="w-3.5 h-3.5 text-[var(--terra-forest)]" strokeWidth={1.5} />
          <span className="text-[var(--terra-ink-muted)]">COVERAGE:</span>
          <span className="font-semibold text-[var(--terra-ink)]">8,769 cells</span>
        </div>

        <div className="flex items-center space-x-1.5 bg-[var(--terra-paper)] border border-[var(--terra-line)] px-2.5 py-1 rounded text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-[var(--terra-ai-accent)]" strokeWidth={1.5} />
          <span className="hidden lg:inline text-[var(--terra-ink-muted)]">ALPHAEARTH SYNC:</span>
          <span className="text-[var(--terra-ink)] font-medium">2026-07-24 06:00 UTC</span>
        </div>
      </div>
    </header>
  );
}
