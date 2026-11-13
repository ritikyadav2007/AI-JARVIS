import os
import io
import wave
import subprocess
import sounddevice as sd
import numpy as np

from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import ClientError, ServerError

from core.ai_engine import ask_jarvis

load_dotenv(".env", override=True)

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL")

if not API_KEY or not MODEL:
    raise RuntimeError("Gemini configuration missing in .env")

client = genai.Client(api_key=API_KEY)

SAMPLE_RATE = 44100
DURATION = 8
SILENCE_THRESHOLD = 150



def listen():
    print("\nJARVIS: Speak now. I am listening...")

    audio = sd.rec(
        int(DURATION * SAMPLE_RATE),
        samplerate=SAMPLE_RATE,
        channels=1,
        dtype="int16"
    )

    sd.wait()
    print("JARVIS: Recording completed.")

    audio_level = np.abs(audio.astype(np.int32)).mean()

    if audio_level < SILENCE_THRESHOLD:
        print("JARVIS: No speech detected. Skipping API request.")
        return None

    return audio.tobytes()


def transcribe(audio_data):
    wav_buffer = io.BytesIO()

    with wave.open(wav_buffer, "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(SAMPLE_RATE)
        wav_file.writeframes(audio_data)

    wav_bytes = wav_buffer.getvalue()

    response = client.models.generate_content(
        model=MODEL,
        contents=[
            (
                "Accurately transcribe speech in its original language. "
                "Support Hindi, Hinglish and English. "
                "Do not translate. Return only the spoken words."
            ),
            types.Part.from_bytes(
                data=wav_bytes,
                mime_type="audio/wav"
            )
        ]
    )

    return (response.text or "").strip()


def speak(text):
    print("\nJARVIS:", text)
    subprocess.run(["say", text], check=True)


def handle_api_error(error):
    error_message = str(error)

    print("\nJARVIS API ERROR:", error_message)

    if "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:
        message = (
            "My Gemini API daily quota has been exceeded. "
            "Please try again after the quota resets."
        )

    elif "503" in error_message or "UNAVAILABLE" in error_message:
        message = (
            "Gemini server is temporarily busy. "
            "Please try again later."
        )

    else:
        message = (
            "I am experiencing a temporary AI service problem. "
            "Please try again later."
        )

    speak(message)


def main():
    print("=" * 40)
    print("       JARVIS VOICE ASSISTANT")
    print("       Continuous Conversation")
    print("=" * 40)

    print("\nJARVIS: I am ready. Start speaking!")
    print("JARVIS: Say 'Stop JARVIS' to exit.")

    try:
        while True:
            audio_data = listen()

            if audio_data is None:
                continue

            print("\nJARVIS: Understanding your voice...")

            try:
                user_text = transcribe(audio_data)

            except (ClientError, ServerError) as error:
                handle_api_error(error)
                break

            if not user_text:
                print("JARVIS: I could not understand.")
                continue

            print("\nYou said:", user_text)

            stop_phrases = [
                "stop jarvis",
                "exit",
                "quit",
                "goodbye",
                "stop listening",
                "बंद हो जाओ",
                "बंद करो",
                "अलविदा"
            ]

            normalized_text = user_text.lower().strip()

            if any(phrase in normalized_text for phrase in stop_phrases):
                speak("Goodbye! Shutting down.")
                break

            print("\nJARVIS: Thinking...")

            try:
                answer = ask_jarvis(user_text)
                speak(answer)

            except (ClientError, ServerError) as error:
                handle_api_error(error)
                break

    except KeyboardInterrupt:
        print("\nJARVIS: Voice assistant stopped.")


if __name__ == "__main__":
    main()
