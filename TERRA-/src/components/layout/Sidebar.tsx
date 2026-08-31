'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MapPin,
  Bell,
  ShieldCheck,
  Dna,
  FileBarChart,
  X,
  Leaf,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Map',
      href: '/map',
      icon: MapPin,
      subtext: 'Geospatial Dashboard',
    },
    {
      name: 'Alerts',
      href: '/alerts',
      icon: Bell,
      subtext: 'Action Center',
    },
    {
      name: 'Carbon Portal',
      href: '/carbon-portal',
      icon: ShieldCheck,
      subtext: 'MRV Verification',
    },
    {
      name: 'Enzyme Designer',
      href: '/enzyme-designer',
      icon: Dna,
      subtext: 'Bioremediation Tool',
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: FileBarChart,
      subtext: 'Resource Optimizer',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[var(--terra-forest)] text-[var(--terra-paper)] flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-white/10 px-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-[var(--terra-paper)] flex items-center justify-center text-[var(--terra-forest)] font-bold font-serif text-lg">
              T
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-tight text-[var(--terra-paper)] leading-none">
                TERRA
              </h1>
              <p className="text-[10px] font-mono tracking-wider text-emerald-300 uppercase mt-0.5">
                Environmental Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={onMobileClose}
            className="md:hidden p-1 rounded text-[var(--terra-paper)]/70 hover:text-white"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Institutional Sub-header */}
        <div className="px-5 py-3 border-b border-white/5 bg-black/10">
          <div className="flex items-center space-x-1.5 text-xs text-emerald-200/80 font-mono">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
            <span>FAO / HWSD v2.0 & AlphaEarth</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={`group flex items-start space-x-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  isActive
                    ? 'bg-[var(--terra-forest-light)] text-white font-medium border-l-2 border-emerald-400'
                    : 'text-[var(--terra-paper)]/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    isActive ? 'text-emerald-400' : 'text-[var(--terra-paper)]/60 group-hover:text-white'
                  }`}
                  strokeWidth={1.5}
                />
                <div>
                  <div className="leading-snug">{item.name}</div>
                  <div
                    className={`text-[11px] font-mono leading-tight ${
                      isActive ? 'text-emerald-200' : 'text-[var(--terra-paper)]/50'
                    }`}
                  >
                    {item.subtext}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Audit Info */}
        <div className="p-4 border-t border-white/10 bg-black/20 text-xs font-mono text-[var(--terra-paper)]/60">
          <div className="flex justify-between items-center mb-1">
            <span>AUDIT STATUS</span>
            <span className="text-emerald-400 font-semibold">VERIFIED</span>
          </div>
          <div className="text-[10px] text-[var(--terra-paper)]/40 leading-tight">
            ISO-14064 Carbon MRV Standard Compliant
          </div>
        </div>
      </aside>
    </>
  );
}
