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
from voice.wake_word import wait_for_wake_word

load_dotenv(".env", override=True)

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL")

if not API_KEY or not MODEL:
    raise RuntimeError("Gemini configuration missing in .env")

client = genai.Client(api_key=API_KEY)

SAMPLE_RATE = 44100
DURATION = 8
SILENCE_THRESHOLD = 40



def listen():
    print("\nJARVIS: Speak now. I am listening...")
    print("JARVIS: Waiting for your voice...")

    FRAME_DURATION = 0.1
    FRAME_SIZE = int(SAMPLE_RATE * FRAME_DURATION)

    START_THRESHOLD = 100
    END_THRESHOLD = 60

    INITIAL_TIMEOUT = 12
    SILENCE_DURATION = 1.2
    MAX_RECORDING_DURATION = 20

    audio_frames = []
    pre_roll = []
    speech_started = False
    silence_frames = 0
    required_silence_frames = int(
        SILENCE_DURATION / FRAME_DURATION
    )

    start_time = __import__("time").time()

    try:
        with sd.InputStream(
            samplerate=SAMPLE_RATE,
            channels=1,
            dtype="int16",
            blocksize=FRAME_SIZE
        ) as stream:

            while True:
                frame, overflowed = stream.read(FRAME_SIZE)
                frame = frame.flatten()

                if overflowed:
                    print("\nJARVIS: Audio buffer overflow.")

                rms = float(
                    np.sqrt(
                        np.mean(frame.astype(float) ** 2)
                    )
                )

                if not speech_started:
                    pre_roll.append(frame.copy())
                    pre_roll = pre_roll[-5:]

                    if rms >= START_THRESHOLD:
                        speech_started = True
                        audio_frames.extend(pre_roll)
                        print("JARVIS: Voice detected. Recording...")
                        continue

                    if (
                        __import__("time").time() - start_time
                        > INITIAL_TIMEOUT
                    ):
                        print("JARVIS: No speech detected.")
                        return None

                else:
                    audio_frames.append(frame.copy())

                    if rms < END_THRESHOLD:
                        silence_frames += 1
                    else:
                        silence_frames = 0

                    elapsed = (
                        __import__("time").time() - start_time
                    )

                    if silence_frames >= required_silence_frames:
                        break

                    if elapsed >= MAX_RECORDING_DURATION:
                        break

        if not audio_frames:
            print("JARVIS: No speech detected.")
            return None

        audio = np.concatenate(audio_frames)

        print("JARVIS: Recording completed.")
        print(
            "JARVIS: Recorded duration:",
            round(len(audio) / SAMPLE_RATE, 2),
            "seconds"
        )

        return audio.astype(np.int16).tobytes()

    except Exception as error:
        print("JARVIS Microphone Error:", error)
        return None


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
    print("=" * 45)
    print("       JARVIS AI VOICE ASSISTANT")
    print("       LOCAL WAKE WORD MODE")
    print("=" * 45)

    print("\nJARVIS: System ready.")
    print("JARVIS: Say 'Hey JARVIS' to activate.")
    print("JARVIS: Say 'Stop listening' for standby.")
    print("JARVIS: Say 'Exit' to shut down.")

    shutdown_phrases = [
        "exit",
        "quit",
        "goodbye",
        "shutdown jarvis",
        "जार्विस बंद हो जाओ",
        "अलविदा"
    ]

    standby_phrases = [
        "stop jarvis",
        "stop listening",
        "go to standby",
        "standby",
        "बंद करो",
        "सुनना बंद करो"
    ]

    try:
        while True:
            try:
                wait_for_wake_word()
            except Exception as error:
                print("\nJARVIS Wake-word Error:", error)
                break

            speak("Yes, I am listening.")

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

                print("\\nYou said:", user_text)

                normalized_text = user_text.lower().strip()

                if any(
                    phrase in normalized_text
                    for phrase in shutdown_phrases
                ):
                    speak("Goodbye! Shutting down.")
                    return

                if any(
                    phrase in normalized_text
                    for phrase in standby_phrases
                ):
                    speak("Going to standby. Say Hey JARVIS to wake me.")
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

    print("JARVIS: Assistant shutdown complete.")


if __name__ == "__main__":
    main()
