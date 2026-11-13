import React, { useState } from 'react';
import { playTacticalClick, playPowerSurge, playAlertChime } from '../utils/audioEffects';
import { stopSpeaking } from '../utils/speech';

export default function AudioDesktopControl({ onSendCommand, isSpeaking }) {
  const [speechRate, setSpeechRate] = useState(1.05);
  const [speechPitch, setSpeechPitch] = useState(0.95);
  const [audioVolume, setAudioVolume] = useState(80);

  return (
    <div className="flex flex-col w-full pb-12 gap-space-lg">
      {/* Top Banner */}
      <div className="bg-surface-container/70 backdrop-blur-xl p-space-md rounded-xl flex items-center justify-between border border-secondary/20 shadow-lg">
        <div className="flex items-center gap-space-sm">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-fixed border border-primary-fixed/20">
            <span className="material-symbols-outlined text-[28px]">tune</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary">
              AUDIO &amp; DESKTOP CONTROL MATRIX
            </span>
            <span className="font-label-code-xs text-label-code-xs text-secondary tracking-wider">
              VOICE SYNTHESIS, SOUND HARMONICS &amp; HARDWARE TELEMETRY
            </span>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <span className="font-label-code-xs text-on-surface-variant">SYNTHESIZER:</span>
          <span className="font-label-telemetry text-primary-container">
            {isSpeaking ? 'TRANSMITTING VOICE' : 'STANDBY'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {/* Voice Synthesizer Calibration */}
        <div className="bg-surface-container-low/80 backdrop-blur-2xl p-space-md rounded-xl shadow-xl flex flex-col gap-space-sm border border-primary-container/20">
          <div className="flex items-center justify-between border-b border-surface-container-high/40 pb-space-xs">
            <span className="font-label-code-xs text-label-code-xs text-primary uppercase tracking-widest">
              // VOICE: SYNTHESIS_CALIBRATION
            </span>
            <span className="material-symbols-outlined text-primary text-[18px]">record_voice_over</span>
          </div>

          <div className="space-y-space-md my-space-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-body-sm text-on-surface-variant">Speech Rate (Speed)</span>
                <span className="font-label-telemetry text-primary">{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.4"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-primary-container"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-body-sm text-on-surface-variant">Speech Pitch (Timbre)</span>
                <span className="font-label-telemetry text-secondary">{speechPitch}</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={speechPitch}
                onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                className="w-full accent-secondary"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-body-sm text-on-surface-variant">Output Master Volume</span>
                <span className="font-label-telemetry text-primary-fixed">{audioVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={audioVolume}
                onChange={(e) => setAudioVolume(parseInt(e.target.value))}
                className="w-full accent-primary-fixed"
              />
            </div>
          </div>

          <div className="flex gap-space-xs pt-space-xs border-t border-surface-container-highest/60">
            <button
              onClick={() => {
                playTacticalClick();
                onSendCommand('Sir, testing J.A.R.V.I.S. voice deck synchronization.');
              }}
              className="flex-1 py-space-xs px-2 rounded bg-primary-container text-on-primary-container font-label-code-xs font-bold transition-all cursor-pointer"
            >
              TEST SYNTHESIZER
            </button>
            <button
              onClick={() => {
                playTacticalClick();
                stopSpeaking();
              }}
              className="py-space-xs px-space-md rounded bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-label-code-xs cursor-pointer"
            >
              MUTE VOICE
            </button>
          </div>
        </div>

        {/* Synthesized Sound Effects Test Bench */}
        <div className="bg-surface-container-low/80 backdrop-blur-2xl p-space-md rounded-xl shadow-xl flex flex-col gap-space-sm border border-secondary/20">
          <div className="flex items-center justify-between border-b border-surface-container-high/40 pb-space-xs">
            <span className="font-label-code-xs text-label-code-xs text-secondary uppercase tracking-widest">
              // ACOUSTICS: HARMONIC_GENERATOR
            </span>
            <span className="material-symbols-outlined text-secondary text-[18px]">graphic_eq</span>
          </div>

          <p className="font-body-sm text-on-surface-variant text-[13px]">
            Real-time synthesized Web Audio API sound generator. Operates with zero network latency and pure oscillator harmonic tones.
          </p>

          <div className="grid grid-cols-3 gap-space-xs my-space-xs">
            <button
              onClick={playTacticalClick}
              className="p-space-sm rounded bg-surface-container/80 hover:bg-surface-container-high text-primary font-label-code-xs flex flex-col items-center gap-1 border border-primary/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">touch_app</span>
              <span>HUD CLICK</span>
            </button>

            <button
              onClick={playPowerSurge}
              className="p-space-sm rounded bg-surface-container/80 hover:bg-surface-container-high text-secondary font-label-code-xs flex flex-col items-center gap-1 border border-secondary/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              <span>POWER SURGE</span>
            </button>

            <button
              onClick={playAlertChime}
              className="p-space-sm rounded bg-surface-container/80 hover:bg-surface-container-high text-tertiary-fixed-dim font-label-code-xs flex flex-col items-center gap-1 border border-tertiary/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              <span>ALERT CHIME</span>
            </button>
          </div>

          <div className="bg-surface-container/60 p-space-xs rounded font-label-code-xs text-[11px] text-on-surface-variant">
            AUDIO DRIVER: High-fidelity Web Audio API engine active
          </div>
        </div>
      </div>
    </div>
  );
}

