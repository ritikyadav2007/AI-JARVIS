import React from 'react';

export default function Footer({ latency = 1.2 }) {
  return (
    <footer className="w-full h-12 bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-between px-space-lg shadow-[0_-1px_6px_rgba(0,0,0,0.3)] border-t border-surface-container-high/40 text-[11px]">
      <div className="flex items-center gap-space-lg">
        <span className="font-label-code-xs text-label-code-xs text-on-surface-variant uppercase">
          // PROTOCOL: HOMERUN STANDBY
        </span>
        <span className="hidden sm:inline font-label-code-xs text-label-code-xs text-on-surface-variant uppercase">
          // SAT-COM: ORBITAL 4 RELAY OK
        </span>
        <span className="hidden md:inline font-label-code-xs text-label-code-xs text-primary-fixed-dim uppercase">
          // ENCRYPTION: 4096-BIT QUANTUM LATTICE
        </span>
      </div>

      <div className="flex items-center gap-space-md">
        <span className="font-label-code-xs text-label-code-xs text-secondary">
          HEAP ALLOC: 42.8 GB / 128 GB
        </span>
        <span className="font-label-telemetry text-label-telemetry text-primary flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping"></span>
          LATENCY: {latency}ms
        </span>
      </div>
    </footer>
  );
}

