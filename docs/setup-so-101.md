# SO-101 Setup Guide with Cyberwave CLI

## Prerequisites

- SO-101 robot arm set (leader + follower)
- External USB or IP camera
- Computer or SBC with USB/serial connection
- Cyberwave account (currently in Private Beta)
- Python 3.11+

## 1. Install Cyberwave CLI

```bash
curl -fsSL https://cyberwave.com/install.sh | bash
```

## 2. Install Edge Core

```bash
sudo cyberwave edge install
```

During installation, you will be prompted to:

1. Authenticate with your Cyberwave credentials
2. Select your environment
3. Select your digital twin
4. The appropriate driver will be automatically installed and configured

## 3. Set Up on Cyberwave Dashboard

1. Create an **Environment** (3D virtual space) in the Cyberwave dashboard
2. Add **SO-101** and **Standard Camera** digital twins from the catalog

## 4. Calibrate the Arms

Find your serial port:

```bash
ls /dev/tty.usbmodem*
```

Calibrate the leader arm:

```bash
so101-calibrate --type leader --port /dev/tty.usbmodem123 --id leader1
```

Calibrate the follower arm:

```bash
so101-calibrate --type follower --port /dev/tty.usbmodem456 --id follower1
```

> Replace `/dev/tty.usbmodem123` and `/dev/tty.usbmodem456` with your actual port numbers.

## 5. Control from PC

### Option A: Python SDK

Install the SDK:

```bash
pip install cyberwave
```

Set your API token (generate from Dashboard > Profile > API Tokens):

```bash
export CYBERWAVE_API_KEY=your_token
```

Control the robot from Python:

```python
import cyberwave as cw

# Connect to your SO-101 digital twin
robot = cw.twin("the-robot-studio/so101")

# Move the robot to a position
robot.edit_position(x=1.0, y=0.0, z=0.5)
robot.edit_rotation(yaw=90)

# Actuate a specific joint to 30 degrees
robot.joints.set("1", 30)
```

### Option B: Dashboard Remote Control

1. Open your environment in the Cyberwave dashboard
2. Click **Assign Controller** on the SO-101 twin
3. Select a controller:
   - **Keyboard** — control individual joints using keyboard keys
   - **VLA Model** — vision-language-action model for autonomous task execution
   - **Custom Controller** — your own registered controller

### Option C: Teleoperation (Leader/Follower)

1. Open your environment in the Cyberwave dashboard
2. Click **Assign Controller**
3. Select **Local Teleop**
4. Move the leader arm by hand — the follower arm mirrors in real-time

## 6. Camera Streaming (Optional)

Install with camera support:

```bash
pip install cyberwave[camera]
```

```python
from cyberwave import Cyberwave
import asyncio
import os

token = os.getenv("CYBERWAVE_API_TOKEN")
client = Cyberwave(token=token)
twin_uuid = os.getenv("TWIN_UUID")

streamer = client.video_stream(
    twin_uuid=twin_uuid,
    camera_id=0,
    fps=10,
)

await streamer.start()
# Keep streaming until interrupted
await streamer.stop()
client.disconnect()
```

## References

- [Cyberwave Platform](https://cyberwave.com/)
- [SO-101 Get Started - Cyberwave Docs](https://docs.cyberwave.com/hardware/so101/get-started)
- [Cyberwave Python SDK](https://docs.cyberwave.com/sdks/python-sdk)
- [Cyberwave GitHub](https://github.com/cyberwave-os)
