import React from 'react';
import { playTacticalClick } from '../utils/audioEffects';

export default function Sidebar({
  activeDirective,
  setActiveDirective,
  backendStatus = 'Online',
  arcStability = 99.8,
  quantumMemory = '1.42 TB / SEC',
}) {
  const directives = [
    { id: 'tactical', num: '01', title: 'Tactical & Suit Ops', icon: 'shield_with_heart' },
    { id: 'mansion', num: '02', title: 'Mansion & Environmental', icon: 'home_pin' },
    { id: 'agent', num: '03', title: 'Agent Operations & Neural', icon: 'neurology' },
    { id: 'audio', num: '04', title: 'Audio & Desktop Control', icon: 'tune' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest/90 backdrop-blur-2xl z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-r border-surface-container-high/40">
      <div className="flex flex-col">
        {/* Top Header */}
        <div className="h-16 px-space-md flex items-center justify-between bg-surface-container-low/50 border-b border-surface-container-high/40">
          <div className="flex items-center gap-space-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus === 'Online'
                  ? 'bg-primary-container animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                  : 'bg-error animate-ping'
              }`}
            ></span>
            <span className="font-label-telemetry text-label-telemetry text-primary tracking-widest uppercase">
              JARVIS // NODES
            </span>
          </div>
          <span className="font-label-code-xs text-label-code-xs text-on-surface-variant">v7.4.2</span>
        </div>

        {/* Real-time Telemetry Gauges */}
        <div className="p-space-md flex flex-col gap-space-sm">
          {/* Arc Flux Stability Gauge */}
          <div className="bg-surface-container/60 p-space-sm rounded-lg flex flex-col gap-space-xs border border-primary-container/10">
            <div className="flex justify-between items-center">
              <span className="font-label-code-xs text-label-code-xs text-on-surface-variant uppercase">
                ARC FLUX STABILITY
              </span>
              <span className="font-label-telemetry text-label-telemetry text-primary-fixed">
                {arcStability}%
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
              <div
                className="bg-primary-container h-full transition-all duration-700 shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                style={{ width: `${arcStability}%` }}
              ></div>
            </div>
          </div>

          {/* Quantum Memory Throughput Gauge */}
          <div className="bg-surface-container/60 p-space-sm rounded-lg flex flex-col gap-space-xs border border-secondary/10">
            <div className="flex justify-between items-center">
              <span className="font-label-code-xs text-label-code-xs text-on-surface-variant uppercase">
                QUANTUM MEMORY
              </span>
              <span className="font-label-telemetry text-label-telemetry text-secondary">
                {quantumMemory}
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
              <div className="bg-secondary-container h-full w-[68%] transition-all duration-700 shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
            </div>
          </div>
        </div>

        {/* Section Matrix Header */}
        <div className="px-space-md py-space-xs">
          <span className="font-label-code-xs text-label-code-xs text-outline uppercase tracking-wider">
            DIRECTIVES MATRIX
          </span>
        </div>

        {/* Navigation Directives */}
        <nav className="flex flex-col gap-space-xs px-space-md">
          {directives.map((dir) => {
            const isActive = activeDirective === dir.id;
            return (
              <button
                key={dir.id}
                onClick={() => {
                  playTacticalClick();
                  setActiveDirective(dir.id);
                }}
                className={`group flex items-center justify-between px-space-md py-space-sm rounded-lg transition-all text-left cursor-pointer border ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_16px_rgba(0,240,255,0.25)] border-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-transparent'
                }`}
              >
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] opacity-75">
                    {dir.icon}
                  </span>
                  <span className="font-title-sm text-title-sm">{dir.title}</span>
                </div>
                <span
                  className={`font-label-code-xs text-label-code-xs ${
                    isActive ? 'opacity-100 font-bold' : 'opacity-60 group-hover:opacity-100'
                  }`}
                >
                  {dir.num}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Stark Biometrics & Security Level */}
      <div className="p-space-md bg-surface-container-lowest border-t border-surface-container-high/40 flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-code-xs text-label-code-xs text-on-surface-variant uppercase">
            DEFENSE OVERRIDE
          </span>
          <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary-fixed-dim font-label-code-xs text-label-code-xs border border-primary-container/20">
            SEC-LVL 5
          </span>
        </div>
        <div className="flex items-center gap-space-sm text-on-surface-variant font-label-code-xs text-label-code-xs">
          <span className="material-symbols-outlined text-primary text-[16px]">fingerprint</span>
          <span>BIOMETRIC: T. STARK VERIFIED</span>
        </div>
      </div>
    </aside>
  );
}

