import time
import numpy as np
import sounddevice as sd

from openwakeword.model import Model

SAMPLE_RATE = 16000
CHUNK_SIZE = 1280
THRESHOLD = 0.35

print("=" * 45)
print("       JARVIS LOCAL WAKE WORD")
print("=" * 45)

print("\nLoading Hey JARVIS model...")

model = Model(
    wakeword_models=[
        "voice/models/hey_jarvis_v0.1.onnx"
    ],
    inference_framework="onnx",
    melspec_model_path="voice/models/melspectrogram.onnx",
    embedding_model_path="voice/models/embedding_model.onnx"
)

print("Model loaded successfully!")
print("\nMicrophone starting...")
print("Say: HEY JARVIS")
print("Press CTRL+C to exit.\n")

armed = True
last_status = time.time()

try:
    with sd.InputStream(
        samplerate=SAMPLE_RATE,
        channels=1,
        dtype="int16",
        blocksize=CHUNK_SIZE
    ) as stream:

        print("JARVIS: Listening locally...")

        while True:
            audio, overflowed = stream.read(CHUNK_SIZE)

            if overflowed:
                print("Warning: Audio buffer overflow")

            audio_data = audio.flatten()

            prediction = model.predict(audio_data)

            score = float(
                prediction.get("hey_jarvis_v0.1", 0.0)
            )

            current_time = time.time()

            if score >= THRESHOLD and armed:
                print(
                    f"\nJARVIS ACTIVATED! Score: {score:.3f}"
                )
                print("JARVIS: Yes, I am listening!")
                armed = False
            if score < 0.2:
                armed = True
            if current_time - last_status >= 1:
                print(
                    f"\rListening... Wake score: {score:.3f}",
                    end="",
                    flush=True
                )
                last_status = current_time

except KeyboardInterrupt:
    print("\n\nJARVIS: Wake word detection stopped.")

except Exception as error:
    print("\nMicrophone error:", error)

finally:
    print("JARVIS: Test finished.")
