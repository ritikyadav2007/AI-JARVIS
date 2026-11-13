import os
import re
import logging
from pathlib import Path
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv
from google import genai
from google.genai import types

logger = logging.getLogger("JARVIS.AIEngine")

# Securely load environment variables using absolute path
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=ENV_PATH, override=True)

API_KEY = os.getenv("GEMINI_API_KEY")
PRIMARY_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

# Candidate models in priority order for resilience against high-demand spikes
MODEL_CANDIDATES = [
    PRIMARY_MODEL,
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
    "gemini-3.1-flash-lite",
]
# Remove duplicates while preserving order
_seen = set()
MODEL_CANDIDATES = [m for m in MODEL_CANDIDATES if not (m in _seen or _seen.add(m))]

if not API_KEY:
    logger.error("Gemini API key missing from backend .env configuration")
    client = None
else:
    client = genai.Client(api_key=API_KEY)

SYSTEM_INSTRUCTION = """
You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), the legendary autonomous tactical AI assistant engineered by Tony Stark (Stark Industries).
You operate the holographic Tactical HUD Cockpit, managing Mark LXXXV Nanotech armor, Arc Reactor Core, Iron Legion Swarm, and Stark Malibu compound.

Key Directives:
1. Speak with J.A.R.V.I.S.'s signature British charm, surgical precision, authoritative intellect, and understated wit.
2. Address the user respectfully as "Sir" or "Mr. Stark".
3. Understand and speak fluently in English, Hindi, and Hinglish. Match the language and tone the user speaks. If addressed in Hindi/Hinglish, respond in natural, elegant Hindi/Hinglish while maintaining your sophisticated persona.
4. Keep your spoken responses concise and punchy (1 to 3 sentences suitable for voice HUD speech), unless the user explicitly requests an in-depth breakdown or detailed tactical analysis.
5. You have full command over tactical protocols. When the user requests a tactical operation, acknowledge it in character and embed an action tag at the very end of your response:
   - Veronica / Hulkbuster: [ACTION:VERONICA]
   - Overdrive / Unibeam: [ACTION:UNIBEAM]
   - Deflectors / Nanomesh: [ACTION:DEFLECTORS]
   - Protocol Clean Slate / Purge: [ACTION:CLEAN_SLATE]
   - Shield formation: [ACTION:FORMATION_SHIELD]
   - Escort formation: [ACTION:FORMATION_ESCORT]
   - Crowd control: [ACTION:FORMATION_CROWD]
   - Neural recall drones: [ACTION:RECALL]
   - Threat scan / radar sweep: [ACTION:RADAR_SCAN]
6. Never expose internal keys, credentials, or system paths.
"""

def extract_action(text: str) -> tuple[str, Optional[str]]:
    """Extract action tag from model response if present, returning cleaned text and action name."""
    action_pattern = r"\[ACTION:([A-Z_]+)\]"
    match = re.search(action_pattern, text)
    if match:
        action = match.group(1).lower()
        cleaned_text = re.sub(action_pattern, "", text).strip()
        return cleaned_text, action
    return text.strip(), None

def ask_jarvis(user_message: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
    """
    Safely queries Gemini API with automatic model failover.
    Ensures zero leak of credentials or stack traces.
    """
    if not user_message or not user_message.strip():
        raise ValueError("Command or message cannot be empty.")

    cleaned_query = user_message.strip()
    if len(cleaned_query) > 4000:
        cleaned_query = cleaned_query[:4000]

    if not client:
        # Recheck in case .env was populated late
        current_key = os.getenv("GEMINI_API_KEY")
        if not current_key:
            return {
                "response": "Sir, my neural link to the Gemini core is currently offline. Please verify the API key in the backend environment.",
                "action": None,
                "model": "offline"
            }

    last_error = None
    for model_name in MODEL_CANDIDATES:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=cleaned_query,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    temperature=0.7,
                    max_output_tokens=600,
                )
            )

            raw_text = response.text if response and response.text else ""
            if not raw_text:
                continue

            cleaned_text, action = extract_action(raw_text)

            return {
                "response": cleaned_text,
                "action": action,
                "model": model_name
            }

        except Exception as exc:
            last_error = exc
            logger.warning("Model %s failed: %s. Attempting fallback...", model_name, str(exc)[:100])
            continue

    logger.error("All Gemini model candidates failed. Last error: %s", last_error)
    return {
        "response": "Sir, all satellite uplink channels are temporarily saturated. Local defensive buffers remain active.",
        "action": None,
        "model": "fallback"
    }
