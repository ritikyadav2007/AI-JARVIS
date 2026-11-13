import logging
import time
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from core.ai_engine import ask_jarvis, PRIMARY_MODEL
from core.intent_router import execute_tactical_action
from core.system_monitor import get_system_metrics

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("JARVIS.Main")

app = FastAPI(
    title="J.A.R.V.I.S. Autonomous Tactical HUD Backend",
    description="Secure Gateway and AI Neural Core for J.A.R.V.I.S. OS v7.4.2",
    version="7.4.2"
)

# Secure CORS configuration
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
    max_age=3600,
)

# Request / Response Schemas
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, description="User command or question for J.A.R.V.I.S.")

class TacticalActionRequest(BaseModel):
    action: str = Field(..., min_length=1, max_length=64, description="Tactical action identifier")

# Rate limiting simple tracking
_request_history: Dict[str, List[float]] = {}
RATE_LIMIT_WINDOW = 60  # seconds
MAX_REQUESTS_PER_WINDOW = 60

def check_rate_limit(client_id: str = "default"):
    now = time.time()
    history = _request_history.setdefault(client_id, [])
    # prune old
    _request_history[client_id] = [t for t in history if now - t < RATE_LIMIT_WINDOW]
    if len(_request_history[client_id]) >= MAX_REQUESTS_PER_WINDOW:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Sir, tactical communications buffer is saturated. Please wait a few seconds."
        )
    _request_history[client_id].append(now)

@app.get("/")
def home():
    return {
        "system": "STARK INDUSTRIES ARC CORE",
        "assistant": "J.A.R.V.I.S.",
        "version": "v7.4.2",
        "status": "ONLINE",
        "protocol": "PROTOCOL 11 ACTIVE"
    }

@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "system": "J.A.R.V.I.S. Core",
        "ai_engine": "Gemini 3.5 Flash",
        "version": "v7.4.2",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/chat")
@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    check_rate_limit()
    try:
        result = ask_jarvis(request.message)
        
        # If an action was extracted by the AI, also get tactical feedback/state
        action_data = None
        if result.get("action"):
            action_data = execute_tactical_action(result["action"])

        return {
            "assistant": "J.A.R.V.I.S.",
            "response": result["response"],
            "action": result["action"],
            "action_details": action_data,
            "model": result.get("model", PRIMARY_MODEL),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("J.A.R.V.I.S. AI processing error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Sir, a neural synchronization fault occurred. Please retry your command."
        )

@app.post("/api/tactical/action")
def tactical_action_endpoint(request: TacticalActionRequest):
    check_rate_limit()
    action_info = execute_tactical_action(request.action)
    if not action_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tactical directive '{request.action}' not recognized in Stark catalog."
        )
    return {
        "status": "EXECUTED",
        "action": request.action,
        "details": action_info,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/api/tactical/status")
def tactical_status():
    return {
        "suit": {
            "platform": "MARK LXXXV // NANOTECH",
            "integrity": 99.4,
            "status": "NOMINAL",
            "coordinates": "34.0259° N, 118.7798° W [POINT DUME CLIFFS]",
            "altitude": "18,400 FT",
            "velocity": "890 KTS",
            "mach": 4.6,
            "unibeam_cooldown": 0.0,
            "nanite_deflectors": "100%",
            "repulsors": "MAX PWR",
            "vector_thrusters": "99.2%",
            "micro_missiles": "12/12"
        },
        "reactor": {
            "output": "12.4 GW",
            "arc_flux_stability": 99.8,
            "vibranium_heat": "312.4 K [OPTIMAL]",
            "quantum_memory": "1.42 TB / SEC"
        },
        "defense": {
            "threat_level": "LEVEL: ALPHA-02",
            "defcon": "DEFCON-2",
            "security_level": "SEC-LVL 5",
            "biometric": "ANTHONY E. STARK // VERIFIED"
        },
        "swarm": {
            "status": "8/8 DEPLOYABLE",
            "formation": "SHIELD",
            "drones": [
                {"id": "LG-01", "role": "LEAD VECTOR", "alt": "2,200m", "batt": 98, "status": "INTERLOCK: ON"},
                {"id": "LG-02", "role": "FLANK PORT", "alt": "2,150m", "batt": 95, "status": "INTERLOCK: ON"},
                {"id": "LG-03", "role": "FLANK STARBOARD", "alt": "2,180m", "batt": 97, "status": "INTERLOCK: ON"},
                {"id": "LG-04", "role": "REAR PERIMETER", "alt": "1,950m", "batt": 91, "status": "PATROL"},
                {"id": "LG-05", "role": "ORBIT SCANNER", "alt": "3,400m", "batt": 89, "status": "SCANNING"},
                {"id": "LG-06", "role": "SUB-SURFACE ACOUSTIC", "alt": "800m", "batt": 94, "status": "STANDBY"},
                {"id": "LG-07", "role": "CIVILIAN CORRIDOR", "alt": "1,100m", "batt": 93, "status": "NOMINAL"},
                {"id": "LG-08", "role": "HEAVY ORDNANCE", "alt": "2,800m", "batt": 100, "status": "HOT CHARGE"}
            ]
        }
    }


@app.get("/api/system/metrics")
def system_metrics_endpoint():
    try:
        return get_system_metrics()
    except Exception:
        logger.exception("System metrics collection failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="System metrics unavailable."
        )
