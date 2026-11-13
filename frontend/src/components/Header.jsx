import React from 'react';
import { playTacticalClick } from '../utils/audioEffects';

export default function Header({
  backendStatus,
  isListening,
  onToggleListening,
  isSpeaking,
  coreHealth = 98.4,
}) {
  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-2xl z-40 flex items-center justify-between px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.3)] border-b border-surface-container-high/40">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-space-md">
        {/* Arc Core Emblem */}
        <div className="w-9 h-9 rounded-full bg-primary-container/10 border border-primary-container/40 flex items-center justify-center relative">
          <span className="w-3.5 h-3.5 rounded-full bg-primary-container animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]"></span>
          <div className="absolute inset-0 rounded-full border border-dashed border-primary-container/30 animate-spin-slow"></div>
        </div>

        <div className="flex flex-col">
          <span className="font-headline-md text-headline-md text-primary tracking-tight leading-none text-[19px]">
            STARK INDUSTRIES ARC CORE
          </span>
          <span className="font-label-code-xs text-label-code-xs text-secondary-fixed tracking-wider mt-1">
            J.A.R.V.I.S. OS v7.4.2 [ONLINE - PROTOCOL 11 ACTIVE]
          </span>
        </div>
      </div>

      {/* Central Telemetry Pills */}
      <div className="hidden xl:flex items-center gap-space-lg">
        <div className="flex items-center gap-space-xs px-space-sm py-1 bg-surface-container/70 rounded-full border border-primary-container/20">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          <span className="font-label-code-xs text-label-code-xs text-on-surface-variant">CORE:</span>
          <span className="font-label-telemetry text-label-telemetry text-primary">{coreHealth}%</span>
        </div>

        <div className="flex items-center gap-space-xs px-space-sm py-1 bg-surface-container/70 rounded-full border border-secondary/20">
          <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping"></span>
          <span className="font-label-code-xs text-label-code-xs text-on-surface-variant">GRID:</span>
          <span className="font-label-telemetry text-label-telemetry text-secondary">SYNCED</span>
        </div>

        <div className="flex items-center gap-space-xs px-space-sm py-1 bg-surface-container/70 rounded-full border border-primary-fixed-dim/20">
          <span className="material-symbols-outlined text-primary-fixed-dim text-[14px]">neurology</span>
          <span className="font-label-code-xs text-label-code-xs text-on-surface-variant">NEURAL:</span>
          <span className="font-label-telemetry text-label-telemetry text-primary-fixed-dim">
            {backendStatus === 'Online' ? 'ACTIVE' : 'STANDBY'}
          </span>
        </div>

        {/* Live Audio Visualizer Bars */}
        <div className="flex items-center gap-1 h-5 px-space-sm bg-surface-container/70 rounded-full border border-primary-container/20">
          <span className={`w-1 rounded-full bg-primary-container ${isSpeaking ? 'h-4 animate-pulse' : 'h-2'}`}></span>
          <span className={`w-1 rounded-full bg-primary-container ${isSpeaking ? 'h-5 animate-pulse' : 'h-3'}`}></span>
          <span className={`w-1 rounded-full bg-secondary ${isSpeaking ? 'h-4 animate-pulse' : 'h-1.5'}`}></span>
          <span className={`w-1 rounded-full bg-primary-container ${isSpeaking ? 'h-5 animate-pulse' : 'h-4'}`}></span>
          <span className={`w-1 rounded-full bg-secondary ${isSpeaking ? 'h-3 animate-pulse' : 'h-2'}`}></span>
        </div>
      </div>

      {/* Voice Control & Biometric Profile */}
      <div className="flex items-center gap-space-md">
        {/* Voice Recognition Toggle Button */}
        <button
          onClick={() => {
            playTacticalClick();
            onToggleListening();
          }}
          className={`flex items-center gap-space-xs px-space-sm py-1 rounded transition-all cursor-pointer border ${
            isListening
              ? 'bg-primary-container/20 border-primary-container text-primary shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'bg-surface-container-high/60 border-surface-container-highest hover:bg-surface-container-high text-on-surface-variant'
          }`}
          title="Click to toggle speech recognition"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isListening ? 'bg-primary-container animate-ping' : 'bg-outline'
            }`}
          ></span>
          <span className="material-symbols-outlined text-[16px]">
            {isListening ? 'mic' : 'mic_none'}
          </span>
          <span className="font-label-code-xs text-label-code-xs uppercase font-medium">
            {isListening ? 'LISTENING...' : 'VOICE DECK'}
          </span>
        </button>

        {/* User Identity Avatar */}
        <div
          className="w-8 h-8 rounded-full bg-primary-container/20 border border-primary-container/50 flex items-center justify-center cursor-pointer group"
          title="Anthony E. Stark // Biometric Confirmed"
        >
          <span className="material-symbols-outlined text-primary text-[18px] group-hover:scale-110 transition-transform">
            person
          </span>
        </div>
      </div>
    </header>
  );
}

