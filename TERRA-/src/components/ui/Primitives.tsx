import React from 'react';
import { RiskLevel } from '@/lib/types';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white border border-[var(--terra-line)] rounded-lg p-5 transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface RiskPillProps {
  level: RiskLevel;
  className?: string;
}

export function RiskPill({ level, className = '' }: RiskPillProps) {
  const styles: Record<RiskLevel, { bg: string; text: string; label: string }> = {
    critical: {
      bg: 'bg-[#B3261E]/10',
      text: 'text-[#B3261E]',
      label: 'CRITICAL RISK',
    },
    high: {
      bg: 'bg-[#B3261E]/10',
      text: 'text-[#B3261E]',
      label: 'HIGH RISK',
    },
    moderate: {
      bg: 'bg-[#E3A008]/15',
      text: 'text-[#B47B00]',
      label: 'MODERATE RISK',
    },
    low: {
      bg: 'bg-[#2E7D32]/10',
      text: 'text-[#2E7D32]',
      label: 'HEALTHY / LOW RISK',
    },
  };

  const current = styles[level] || styles.low;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-mono font-medium tracking-wider uppercase ${current.bg} ${current.text} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {current.label}
    </span>
  );
}

interface StatChipProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  variant?: 'default' | 'soil' | 'ai' | 'risk';
}

export function StatChip({
  label,
  value,
  unit,
  subtext,
  variant = 'default',
}: StatChipProps) {
  const borderColor =
    variant === 'soil'
      ? 'border-[var(--terra-soil)]/40 bg-[var(--terra-soil)]/5'
      : variant === 'ai'
      ? 'border-[var(--terra-ai-accent)]/40 bg-[var(--terra-ai-accent)]/5'
      : 'border-[var(--terra-line)] bg-white';

  return (
    <div className={`p-3 rounded-lg border ${borderColor} flex flex-col justify-between`}>
      <span className="text-xs uppercase tracking-wider text-[var(--terra-ink-muted)] font-medium mb-1">
        {label}
      </span>
      <div className="flex items-baseline space-x-1">
        <span className="text-xl font-mono font-semibold text-[var(--terra-ink)]">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-[var(--terra-ink-muted)]">
            {unit}
          </span>
        )}
      </div>
      {subtext && (
        <span className="text-[11px] text-[var(--terra-ink-muted)] mt-1">
          {subtext}
        </span>
      )}
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'soil' | 'ai' | 'forest';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const styles = {
    default: 'bg-[var(--terra-paper)] text-[var(--terra-ink)] border-[var(--terra-line)]',
    soil: 'bg-[var(--terra-soil)]/10 text-[var(--terra-soil)] border-[var(--terra-soil)]/30',
    ai: 'bg-[var(--terra-ai-accent)]/10 text-[var(--terra-ai-accent)] border-[var(--terra-ai-accent)]/30',
    forest: 'bg-[var(--terra-forest)] text-[var(--terra-paper)] border-transparent',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
