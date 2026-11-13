# STARK INDUSTRIES ARC CORE // J.A.R.V.I.S. OS v7.4.2

Autonomous Tactical HUD Desktop Assistant powered by **Google Gemini API**, featuring a **Secure Multi-Tier Architecture** (Frontend + Backend Gateway).

---

## 🔒 Security Architecture (Gemini API Safety)

This system is built with **zero client-side credential exposure**:

1. **Server-Side API Key Isolation**:
   - `GEMINI_API_KEY` is loaded exclusively on the FastAPI backend from `/backend/.env`.
   - The frontend Vite React application **never** receives, bundles, or accesses the API key.
   - All client network requests route through `http://127.0.0.1:8000/api/chat`.

2. **CORS & Input Hardening**:
   - Backend CORS strictly restricts access to `http://localhost:5173` and `http://127.0.0.1:5173`.
   - Request validation limits message length to 4000 characters and strips malicious payloads.
   - Error messages are sanitized so stack traces and internal paths are never returned to the browser.

3. **Multi-Model Failover Resilience**:
   - Automatically prioritizes `gemini-3.5-flash-lite`, cascading to `gemini-3.8-flash` and `gemini-3.1-flash-lite` if high-demand spikes (503 / 429) occur.

---

## 🚀 Quick Launch

To start both the backend server and frontend HUD simultaneously:

```bash
cd /Users/ritikdagar/Projects/JARVIS
./start.sh
```

Or start them individually:

### Backend
```bash
cd /Users/ritikdagar/Projects/JARVIS/backend
source .venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend
```bash
cd /Users/ritikdagar/Projects/JARVIS/frontend
npm run dev
```

Open your browser at: **`http://127.0.0.1:5173`**

---

## 🛰️ Directives Matrix

- **01 Tactical & Suit Ops**:
  - Live Mark LXXXV Nanotech Armor holographic projection with interactive HUD anchors.
  - Rotating Arc Reactor flux core (12.4 GW) & Vibranium core heat live sparkline.
  - Phased-array Threat Radar Analyzer tracking hostile blips.
  - Iron Legion Swarm matrix (8 deployable drones: Shield, Escort, Crowd formations).
  - Tactical Override Deck: Unibeam Overdrive, Veronica Hulkbuster deployment, Deflector nanomesh cycle, and Protocol Clean Slate.
- **02 Mansion & Environmental**:
  - Malibu Point Dume residence climate, perimeter defense laser grid, and smart arc power routing.
- **03 Agent Operations & Neural**:
  - Full AI console with chat history, instant prompt chips, and multi-language support (English, Hindi, Hinglish).
- **04 Audio & Desktop Control**:
  - Web Audio API harmonics generator and voice synthesizer calibration (speed, pitch, volume).

---

## 🎙️ Voice & Sound Interaction

- **Voice Input (Speech-to-Text)**: Click the **"VOICE DECK"** button or the microphone icon to speak commands hands-free.
- **Voice Output (Text-to-Speech)**: J.A.R.V.I.S. speaks back in real time with synchronized holographic audio waveforms.
- **Acoustic Harmonics**: Built-in Web Audio API sound effects for HUD clicks, power surges, and tactical alerts.

