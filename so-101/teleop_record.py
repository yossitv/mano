"""
Teleoperation + Recording Script for SO-101
- Reads Leader arm positions
- Mirrors to Follower arm in real-time
- Records joint positions + camera frames
- Saves dataset as JSON + images

Usage:
    python scripts/teleop_record.py
    Press 'r' to start/stop recording
    Press 'q' to quit
"""

import cv2
import json
import os
import time
from datetime import datetime
from pathlib import Path
from scservo_sdk import *

# === Config ===
LEADER_PORT = "/dev/tty.usbmodem5AE60552071"
FOLLOWER_PORT = "/dev/tty.usbmodem5AE60824111"
CAMERA_INDEX = 0
BAUDRATE = 1000000
FREQUENCY = 20  # Hz
NUM_MOTORS = 6

# Servo registers
ADDR_PRESENT_POSITION = 56
ADDR_GOAL_POSITION = 42
ADDR_TORQUE_ENABLE = 40

# Dataset output
DATASET_DIR = Path("data")


def init_bus(port):
    port_handler = PortHandler(port)
    packet_handler = PacketHandler(0)
    if not port_handler.openPort():
        raise RuntimeError("Failed to open port: %s" % port)
    port_handler.setBaudRate(BAUDRATE)
    return port_handler, packet_handler


def read_positions(port_handler, packet_handler):
    positions = {}
    for motor_id in range(1, NUM_MOTORS + 1):
        pos, result, _ = packet_handler.read2ByteTxRx(
            port_handler, motor_id, ADDR_PRESENT_POSITION
        )
        if result == COMM_SUCCESS:
            positions[motor_id] = pos
    return positions


def write_positions(port_handler, packet_handler, positions):
    for motor_id, pos in positions.items():
        packet_handler.write2ByteTxRx(
            port_handler, motor_id, ADDR_GOAL_POSITION, pos
        )


def enable_torque(port_handler, packet_handler, enable=True):
    val = 1 if enable else 0
    for motor_id in range(1, NUM_MOTORS + 1):
        packet_handler.write1ByteTxRx(
            port_handler, motor_id, ADDR_TORQUE_ENABLE, val
        )


def main():
    # Init Leader
    print("Connecting Leader arm (%s)..." % LEADER_PORT)
    leader_ph, leader_pk = init_bus(LEADER_PORT)
    print("  OK")

    # Init Follower
    print("Connecting Follower arm (%s)..." % FOLLOWER_PORT)
    follower_ph, follower_pk = init_bus(FOLLOWER_PORT)
    enable_torque(follower_ph, follower_pk, True)
    print("  OK")

    # Init Camera
    print("Opening camera (index %d)..." % CAMERA_INDEX)
    cap = cv2.VideoCapture(CAMERA_INDEX)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    # Warm up (Pixel 10 needs ~30 frames to initialize)
    for _ in range(30):
        cap.read()
    print("  OK")

    # State
    recording = False
    episode_data = []
    episode_count = 0
    frame_count = 0
    interval = 1.0 / FREQUENCY

    print()
    print("=== Teleoperation Ready ===")
    print("  Move the Leader arm -> Follower mirrors")
    print("  Press 'r' to start/stop recording")
    print("  Press 'q' to quit")
    print()

    try:
        while True:
            t_start = time.time()

            # Read Leader positions
            leader_pos = read_positions(leader_ph, leader_pk)

            # Mirror to Follower
            if leader_pos:
                write_positions(follower_ph, follower_pk, leader_pos)

            # Capture camera frame
            ret, frame = cap.read()

            # Recording
            if recording and ret and leader_pos:
                # Save frame
                frame_path = episode_dir / ("frame_%05d.jpg" % frame_count)
                cv2.imwrite(str(frame_path), frame)

                # Save data point
                episode_data.append({
                    "timestamp": time.time(),
                    "frame": frame_count,
                    "leader_joints": {str(k): v for k, v in leader_pos.items()},
                    "follower_joints": {str(k): v for k, v in read_positions(follower_ph, follower_pk).items()},
                })
                frame_count += 1

                if frame_count % 20 == 0:
                    print("  Recording... %d frames" % frame_count)

            # Show camera feed
            if ret:
                display = frame.copy()
                status = "REC [%d frames]" % frame_count if recording else "STANDBY"
                color = (0, 0, 255) if recording else (0, 255, 0)
                cv2.putText(display, status, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

                # Show joint positions
                if leader_pos:
                    y = 60
                    for mid, pos in sorted(leader_pos.items()):
                        cv2.putText(display, "M%d: %d" % (mid, pos), (10, y),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
                        y += 20

                cv2.imshow("SO-101 Teleop", display)

            # Key handling
            key = cv2.waitKey(1) & 0xFF

            if key == ord("r"):
                if not recording:
                    # Start recording
                    episode_count += 1
                    episode_dir = DATASET_DIR / ("episode_%03d" % episode_count)
                    episode_dir.mkdir(parents=True, exist_ok=True)
                    episode_data = []
                    frame_count = 0
                    recording = True
                    print(">>> Recording started (episode %d)" % episode_count)
                else:
                    # Stop recording
                    recording = False
                    # Save episode metadata
                    meta_path = episode_dir / "episode.json"
                    meta = {
                        "episode": episode_count,
                        "frames": frame_count,
                        "frequency_hz": FREQUENCY,
                        "recorded_at": datetime.now().isoformat(),
                        "leader_port": LEADER_PORT,
                        "follower_port": FOLLOWER_PORT,
                        "data": episode_data,
                    }
                    with open(meta_path, "w") as f:
                        json.dump(meta, f, indent=2)
                    print(">>> Recording stopped. Saved %d frames to %s" % (frame_count, episode_dir))

            elif key == ord("q"):
                break

            # Maintain frequency
            elapsed = time.time() - t_start
            if elapsed < interval:
                time.sleep(interval - elapsed)

    except KeyboardInterrupt:
        print("\nInterrupted.")

    finally:
        # Cleanup
        print("Shutting down...")
        enable_torque(follower_ph, follower_pk, False)
        leader_ph.closePort()
        follower_ph.closePort()
        cap.release()
        cv2.destroyAllWindows()
        print("Done. Recorded %d episodes." % episode_count)


if __name__ == "__main__":
    main()
