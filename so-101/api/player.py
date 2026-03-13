"""
Scenario playback controller for SO-101 follower arm.
Manages servo connection and async episode replay.
"""

import asyncio
import json
import glob
import os
import time
from pathlib import Path
from typing import Optional

from scservo_sdk import PortHandler, PacketHandler

BAUDRATE = 1000000
ADDR_GOAL_POSITION = 42
ADDR_TORQUE_ENABLE = 40
NUM_MOTORS = 6

DATA_DIR = Path(__file__).parent.parent / "data"


class Player:
    def __init__(self):
        self.status: str = "idle"
        self.scenario_id: Optional[int] = None
        self.current_frame: int = 0
        self.total_frames: int = 0
        self._task: Optional[asyncio.Task] = None
        self._stop_event = asyncio.Event()
        self._port_handler: Optional[PortHandler] = None
        self._packet_handler: Optional[PacketHandler] = None
        self.follower_port: Optional[str] = None

    def _detect_port(self) -> str:
        """Auto-detect follower arm serial port."""
        if self.follower_port:
            return self.follower_port

        env_port = os.environ.get("FOLLOWER_PORT")
        if env_port:
            return env_port

        # macOS: look for usbmodem devices
        ports = sorted(glob.glob("/dev/tty.usbmodem*"))
        if ports:
            # If multiple ports, use the last one (follower is typically the second)
            return ports[-1] if len(ports) > 1 else ports[0]

        raise RuntimeError("No serial port found. Set FOLLOWER_PORT env var.")

    def _connect(self):
        """Open serial connection to follower arm."""
        if self._port_handler is not None:
            return

        port = self._detect_port()
        self._port_handler = PortHandler(port)
        self._packet_handler = PacketHandler(0)

        if not self._port_handler.openPort():
            self._port_handler = None
            raise RuntimeError("Failed to open port: %s" % port)

        self._port_handler.setBaudRate(BAUDRATE)

    def _disconnect(self):
        """Close serial connection."""
        if self._port_handler:
            self._port_handler.closePort()
            self._port_handler = None
            self._packet_handler = None

    def _enable_torque(self, enable: bool):
        val = 1 if enable else 0
        for motor_id in range(1, NUM_MOTORS + 1):
            self._packet_handler.write1ByteTxRx(
                self._port_handler, motor_id, ADDR_TORQUE_ENABLE, val
            )

    def _write_positions(self, joints: dict):
        for motor_id_str, pos in joints.items():
            motor_id = int(motor_id_str)
            self._packet_handler.write2ByteTxRx(
                self._port_handler, motor_id, ADDR_GOAL_POSITION, pos
            )

    def list_scenarios(self) -> list[dict]:
        """List all available episodes in data directory."""
        scenarios = []
        if not DATA_DIR.exists():
            return scenarios

        for episode_dir in sorted(DATA_DIR.iterdir()):
            meta_path = episode_dir / "episode.json"
            if not meta_path.exists():
                continue
            with open(meta_path) as f:
                meta = json.load(f)
            freq = meta.get("frequency_hz", 20)
            frames = meta.get("frames", len(meta.get("data", [])))
            scenarios.append({
                "id": meta.get("episode", int(episode_dir.name.split("_")[-1])),
                "frames": frames,
                "duration_sec": round(frames / freq, 1),
                "frequency_hz": freq,
                "recorded_at": meta.get("recorded_at"),
            })
        return scenarios

    def _find_episode_dir(self, scenario_id: int) -> Optional[Path]:
        """Find episode directory by scenario ID."""
        # Try zero-padded formats: episode_002, episode_02, episode_2
        for pattern in ["episode_%03d", "episode_%02d", "episode_%d"]:
            path = DATA_DIR / (pattern % scenario_id)
            if path.exists() and (path / "episode.json").exists():
                return path
        return None

    async def play(self, scenario_id: int) -> dict:
        """Start playing a scenario. Returns metadata."""
        if self.status == "playing":
            raise RuntimeError("Already playing scenario %d" % self.scenario_id)

        episode_dir = self._find_episode_dir(scenario_id)
        if episode_dir is None:
            raise FileNotFoundError("Scenario %d not found" % scenario_id)

        with open(episode_dir / "episode.json") as f:
            meta = json.load(f)

        data = meta["data"]
        freq = meta.get("frequency_hz", 20)
        frames = len(data)

        self._connect()
        self._enable_torque(True)

        self.scenario_id = scenario_id
        self.total_frames = frames
        self.current_frame = 0
        self.status = "playing"
        self._stop_event.clear()

        self._task = asyncio.create_task(self._replay_loop(data, freq))

        return {
            "status": "playing",
            "scenario_id": scenario_id,
            "frames": frames,
            "duration_sec": round(frames / freq, 1),
            "frequency_hz": freq,
        }

    async def _replay_loop(self, data: list[dict], freq: int):
        """Background replay loop."""
        interval = 1.0 / freq
        try:
            for i, frame_data in enumerate(data):
                if self._stop_event.is_set():
                    break

                t_start = time.time()
                joints = frame_data.get("follower_joints", frame_data.get("leader_joints", {}))
                self._write_positions(joints)
                self.current_frame = i + 1

                elapsed = time.time() - t_start
                if elapsed < interval:
                    await asyncio.sleep(interval - elapsed)

            self.status = "idle"
        except Exception:
            self.status = "error"
        finally:
            self._enable_torque(False)
            self._disconnect()
            self.scenario_id = None

    async def stop(self):
        """Stop current playback."""
        if self._task and not self._task.done():
            self._stop_event.set()
            await self._task
        self.status = "idle"

    def get_status(self) -> dict:
        """Return current playback status."""
        result = {"status": self.status}
        if self.status == "playing" and self.scenario_id is not None:
            result.update({
                "scenario_id": self.scenario_id,
                "current_frame": self.current_frame,
                "total_frames": self.total_frames,
                "progress_percent": round(
                    (self.current_frame / self.total_frames * 100) if self.total_frames > 0 else 0, 1
                ),
            })
        return result
