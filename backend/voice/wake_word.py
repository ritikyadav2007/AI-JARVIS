import time
import sounddevice as sd

from openwakeword.model import Model


SAMPLE_RATE = 16000
CHUNK_SIZE = 1280
THRESHOLD = 0.35
REARM_THRESHOLD = 0.2


print("JARVIS: Loading local wake-word model...")

wake_model = Model(
    wakeword_models=[
        "voice/models/hey_jarvis_v0.1.onnx"
    ],
    inference_framework="onnx",
    melspec_model_path="voice/models/melspectrogram.onnx",
    embedding_model_path="voice/models/embedding_model.onnx"
)

print("JARVIS: Wake-word model ready!")


def wait_for_wake_word():
    armed = True
    last_status = time.time()

    print("\nJARVIS: Standby mode.")
    print("JARVIS: Say HEY JARVIS to activate.")

    with sd.InputStream(
        samplerate=SAMPLE_RATE,
        channels=1,
        dtype="int16",
        blocksize=CHUNK_SIZE
    ) as stream:

        while True:
            audio, overflowed = stream.read(CHUNK_SIZE)

            if overflowed:
                print("\nJARVIS: Audio buffer overflow.")

            prediction = wake_model.predict(audio.flatten())

            score = float(
                prediction.get("hey_jarvis_v0.1", 0.0)
            )

            if score < REARM_THRESHOLD:
                armed = True

            if score >= THRESHOLD and armed:
                print(
                    f"\nJARVIS ACTIVATED! Score: {score:.3f}"
                )
                return True

            if time.time() - last_status >= 1:
                print(
                    f"\rStandby... Wake score: {score:.3f}",
                    end="",
                    flush=True
                )
                last_status = time.time()
