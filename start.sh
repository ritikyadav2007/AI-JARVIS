#!/usr/bin/env bash
# ==============================================================================
# STARK INDUSTRIES // J.A.R.V.I.S. OS v7.4.2 LAUNCHER
# Starts the Secure FastAPI Backend Gateway and the Vite Tactical HUD Frontend
# ==============================================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo "============================================================"
echo "  STARK INDUSTRIES ARC CORE // J.A.R.V.I.S. OS v7.4.2"
echo "  Secure Backend Gateway + Autonomous Tactical HUD"
echo "============================================================"

# Check Python Virtual Environment
if [ ! -d "$BACKEND_DIR/.venv" ]; then
    echo "[!] Backend virtualenv missing at $BACKEND_DIR/.venv"
    echo "    Run: cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Check .env file
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo "[!] Backend .env missing at $BACKEND_DIR/.env"
    exit 1
fi

echo "[*] Activating Secure Backend Gateway (Port 8000)..."
cd "$BACKEND_DIR"
"$BACKEND_DIR/.venv/bin/uvicorn" main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

echo "[*] Launching Holographic Tactical HUD Frontend (Port 5173)..."
cd "$FRONTEND_DIR"
npm run dev -- --host 127.0.0.1 --port 5173 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM EXIT

echo ""
echo "[✓] J.A.R.V.I.S. Systems Online:"
echo "    - Tactical HUD Frontend: http://127.0.0.1:5173"
echo "    - Secure Backend Gateway: http://127.0.0.1:8000"
echo "    - Health Check:           http://127.0.0.1:8000/health"
echo "    Press Ctrl+C to terminate all services."
echo ""

wait

