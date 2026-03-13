"""
Replay a recorded episode on the Follower arm with video playback.

Usage:
    python scripts/replay_episode.py data/episode_001
"""

import cv2
import json
import sys
import time
from pathlib import Path
from scservo_sdk import *

FOLLOWER_PORT = "/dev/tty.usbmodem5AE60824111"
BAUDRATE = 1000000
ADDR_GOAL_POSITION = 42
ADDR_TORQUE_ENABLE = 40
NUM_MOTORS = 6


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/replay_episode.py <episode_dir>")
        print("Example: python scripts/replay_episode.py data/episode_001")
        sys.exit(1)

    episode_dir = Path(sys.argv[1])
    meta_path = episode_dir / "episode.json"

    if not meta_path.exists():
        print("episode.json not found in %s" % episode_dir)
        sys.exit(1)

    with open(meta_path) as f:
        meta = json.load(f)

    data = meta["data"]
    freq = meta.get("frequency_hz", 20)
    interval = 1.0 / freq

    print("Episode: %s" % episode_dir)
    print("Frames: %d" % len(data))
    print("Frequency: %d Hz" % freq)
    print()

    # Init Follower
    port_handler = PortHandler(FOLLOWER_PORT)
    packet_handler = PacketHandler(0)
    port_handler.openPort()
    port_handler.setBaudRate(BAUDRATE)

    for motor_id in range(1, NUM_MOTORS + 1):
        packet_handler.write1ByteTxRx(port_handler, motor_id, ADDR_TORQUE_ENABLE, 1)

    print("Press 'q' to stop, SPACE to pause/resume")
    print("Replaying...")

    paused = False

    try:
        for i, frame_data in enumerate(data):
            t_start = time.time()

            # Move follower to recorded positions
            joints = frame_data.get("follower_joints", frame_data.get("leader_joints", {}))
            for motor_id_str, pos in joints.items():
                motor_id = int(motor_id_str)
                packet_handler.write2ByteTxRx(port_handler, motor_id, ADDR_GOAL_POSITION, pos)

            # Show recorded frame
            frame_path = episode_dir / ("frame_%05d.jpg" % i)
            if frame_path.exists():
                img = cv2.imread(str(frame_path))
                cv2.putText(img, "Replay %d/%d" % (i + 1, len(data)), (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                cv2.imshow("Replay", img)

            key = cv2.waitKey(1) & 0xFF
            if key == ord("q"):
                break
            elif key == ord(" "):
                paused = not paused
                while paused:
                    key2 = cv2.waitKey(100) & 0xFF
                    if key2 == ord(" "):
                        paused = False
                    elif key2 == ord("q"):
                        paused = False
                        break

            elapsed = time.time() - t_start
            if elapsed < interval:
                time.sleep(interval - elapsed)

        print("Replay complete.")

    except KeyboardInterrupt:
        print("\nInterrupted.")

    finally:
        for motor_id in range(1, NUM_MOTORS + 1):
            packet_handler.write1ByteTxRx(port_handler, motor_id, ADDR_TORQUE_ENABLE, 0)
        port_handler.closePort()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
