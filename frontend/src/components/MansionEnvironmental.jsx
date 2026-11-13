import React, { useState } from 'react';
import { playTacticalClick, playAlertChime } from '../utils/audioEffects';

export default function MansionEnvironmental({ onSendCommand }) {
  const [perimeterLocked, setPerimeterLocked] = useState(true);
  const [hvacTemp, setHvacTemp] = useState(21.5);
  const [smartGlassOpacity, setSmartGlassOpacity] = useState(85);
  const [arcPowerRouting, setArcPowerRouting] = useState('WORKSHOP');

  return (
    <div className="flex flex-col w-full pb-12 gap-space-lg">
      {/* Top Banner */}
      <div className="bg-surface-container/70 backdrop-blur-xl p-space-md rounded-xl flex items-center justify-between border border-secondary/20 shadow-lg">
        <div className="flex items-center gap-space-sm">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary border border-secondary/20">
            <span className="material-symbols-outlined text-[28px]">home_pin</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary">
              10880 MALIBU POINT // RESIDENCE
            </span>
            <span className="font-label-code-xs text-label-code-xs text-secondary tracking-wider">
              SMART ENVIRONMENTAL &amp; DEFENSE AUTOMATION
            </span>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse"></span>
          <span className="font-label-telemetry text-label-telemetry text-primary-fixed">
            ALL SECTORS NOMINAL
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Perimeter Defense & Security Pod */}
        <div className="bg-surface-container-low/80 backdrop-blur-2xl p-space-md rounded-xl shadow-xl flex flex-col gap-space-sm border border-primary-container/20">
          <div className="flex items-center justify-between border-b border-surface-container-high/40 pb-space-xs">
            <span className="font-label-code-xs text-label-code-xs text-primary uppercase tracking-widest">
              // DEFENSE: PERIMETER_SECURITY
            </span>
            <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
          </div>

          <div className="flex flex-col gap-space-xs my-space-xs">
            <div className="flex justify-between items-center bg-surface-container/60 p-space-xs rounded">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Perimeter Laser Grid</span>
              <span className="font-label-code-xs text-primary-fixed">ARMED (500nm)</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container/60 p-space-xs rounded">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Sub-surface Sensors</span>
              <span className="font-label-code-xs text-secondary">16/16 ACTIVE</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container/60 p-space-xs rounded">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Airspace Ceiling</span>
              <span className="font-label-code-xs text-tertiary-fixed-dim">RESTRICTED 5,000 FT</span>
            </div>
          </div>

          <button
            onClick={() => {
              playAlertChime();
              setPerimeterLocked(!perimeterLocked);
              onSendCommand(
                perimeterLocked
                  ? 'Disengage full mansion lockdown mode'
                  : 'Engage full mansion lockdown and reinforce cliffside barriers'
              );
            }}
            className={`py-space-sm px-space-md rounded font-label-code-xs uppercase font-bold transition-all cursor-pointer ${
              perimeterLocked
                ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-surface-container-highest text-primary hover:bg-surface-container-high'
            }`}
          >
            {perimeterLocked ? 'LOCKDOWN: ENGAGED' : 'ENGAGE LOCKDOWN'}
          </button>
        </div>

        {/* Climate & Atmosphere Pod */}
        <div className="bg-surface-container-low/80 backdrop-blur-2xl p-space-md rounded-xl shadow-xl flex flex-col gap-space-sm border border-secondary/20">
          <div className="flex items-center justify-between border-b border-surface-container-high/40 pb-space-xs">
            <span className="font-label-code-xs text-label-code-xs text-secondary uppercase tracking-widest">
              // CLIMATE: HVAC_ZONES
            </span>
            <span className="material-symbols-outlined text-secondary text-[18px]">thermostat</span>
          </div>

          <div className="flex flex-col gap-space-xs my-space-xs">
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Workshop Sub-level</span>
              <span className="font-label-telemetry text-primary text-[15px]">{hvacTemp.toFixed(1)}°C</span>
            </div>
            <input
              type="range"
              min="18"
              max="26"
              step="0.5"
              value={hvacTemp}
              onChange={(e) => setHvacTemp(parseFloat(e.target.value))}
              className="w-full accent-primary-container"
            />

            <div className="flex justify-between items-center mt-space-xs">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Smart Glass Electrochromic</span>
              <span className="font-label-telemetry text-secondary text-[15px]">{smartGlassOpacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={smartGlassOpacity}
              onChange={(e) => setSmartGlassOpacity(parseInt(e.target.value))}
              className="w-full accent-secondary"
            />
          </div>

          <button
            onClick={() => {
              playTacticalClick();
              onSendCommand(`Calibrate mansion climate to ${hvacTemp}°C with glass opacity at ${smartGlassOpacity}%`);
            }}
            className="py-space-sm px-space-md rounded bg-surface-container-highest hover:bg-surface-container-high text-primary font-label-code-xs uppercase font-bold transition-all cursor-pointer"
          >
            APPLY CLIMATE PROFILE
          </button>
        </div>

        {/* Arc Power Grid Distribution */}
        <div className="bg-surface-container-low/80 backdrop-blur-2xl p-space-md rounded-xl shadow-xl flex flex-col gap-space-sm border border-primary-fixed-dim/20">
          <div className="flex items-center justify-between border-b border-surface-container-high/40 pb-space-xs">
            <span className="font-label-code-xs text-label-code-xs text-primary uppercase tracking-widest">
              // POWER: ARC_GRID_BUS
            </span>
            <span className="material-symbols-outlined text-primary-fixed-dim text-[18px]">power</span>
          </div>

          <div className="flex flex-col gap-space-xs my-space-xs">
            {['WORKSHOP', 'MAIN_VILLA', 'DEFENSE_ARRAY', 'DOCKING_BAY'].map((zone) => (
              <div
                key={zone}
                onClick={() => {
                  playTacticalClick();
                  setArcPowerRouting(zone);
                }}
                className={`p-space-xs rounded flex justify-between items-center cursor-pointer transition-all ${
                  arcPowerRouting === zone
                    ? 'bg-primary-container/20 border border-primary-container text-primary'
                    : 'bg-surface-container/60 text-on-surface-variant hover:bg-surface-container-high/60'
                }`}
              >
                <span className="font-label-code-xs">{zone.replace('_', ' ')}</span>
                <span className="font-label-telemetry text-[11px]">
                  {arcPowerRouting === zone ? 'PRIORITY BUS' : 'BALANCED'}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              playTacticalClick();
              onSendCommand(`Re-route primary arc reactor grid power to ${arcPowerRouting}`);
            }}
            className="py-space-sm px-space-md rounded bg-surface-container-highest hover:bg-surface-container-high text-primary font-label-code-xs uppercase font-bold transition-all cursor-pointer"
          >
            ROUTE ARC FLUX
          </button>
        </div>
      </div>
    </div>
  );
}

