import psutil
import time
from datetime import datetime, timezone

NETWORK_INTERFACE = "en0"
_previous_network = None


def get_system_metrics():
    global _previous_network

    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    battery = psutil.sensors_battery()

    now = time.monotonic()
    interface = psutil.net_io_counters(pernic=True).get(NETWORK_INTERFACE)

    upload_mbps = 0.0
    download_mbps = 0.0

    if interface:
        current = {
            "sent": interface.bytes_sent,
            "recv": interface.bytes_recv,
            "time": now,
        }

        if _previous_network:
            elapsed = now - _previous_network["time"]

            if elapsed > 0:
                upload_mbps = max(
                    0, (current["sent"] - _previous_network["sent"]) * 8
                    / elapsed / 1_000_000
                )
                download_mbps = max(
                    0, (current["recv"] - _previous_network["recv"]) * 8
                    / elapsed / 1_000_000
                )

        _previous_network = current

    return {
        "status": "online",
        "source": "macOS host system",
        "timestamp": datetime.now(timezone.utc).isoformat(),

        "cpu": {
            "usage_percent": psutil.cpu_percent(interval=0.2),
            "logical_cores": psutil.cpu_count(logical=True),
        },

        "memory": {
            "total_gb": round(memory.total / (1024 ** 3), 2),
            "used_gb": round(memory.used / (1024 ** 3), 2),
            "available_gb": round(memory.available / (1024 ** 3), 2),
            "usage_percent": memory.percent,
        },

        "disk": {
            "total_gb": round(disk.total / (1024 ** 3), 2),
            "used_gb": round(disk.used / (1024 ** 3), 2),
            "free_gb": round(disk.free / (1024 ** 3), 2),
            "usage_percent": disk.percent,
        },

        "battery": {
            "available": battery is not None,
            "percent": battery.percent if battery else None,
            "plugged_in": battery.power_plugged if battery else None,
            "status": (
                "plugged_in" if battery and battery.power_plugged
                else "on_battery" if battery
                else "unavailable"
            ),
        },

        "network": {
            "available": interface is not None,
            "interface": NETWORK_INTERFACE,
            "upload_mbps": round(upload_mbps, 3),
            "download_mbps": round(download_mbps, 3),
        },

        "temperature": {
            "available": False,
            "status": "unsupported_by_psutil_on_this_mac",
            "celsius": None,
        },
    }
