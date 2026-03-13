# SO-101 Training Pipeline

End-to-end guide for recording teleoperation data, training an ML model, and deploying it to the SO-101.

## Overview

```
1. Setup        → Leader + Follower + Camera connected
2. Record       → Teleoperate and capture demonstrations
3. Dataset      → Trim, label, and assemble episodes
4. Train        → Train a model on the dataset
5. Deploy       → Run the trained model on the physical arm
```

## Prerequisites

- SO-101 leader arm + follower arm (both calibrated)
- External USB or IP camera
- Cyberwave account with environment configured
- Edge Core running and paired with SO-101 digital twin
- Python 3.11+ with `feetech-servo-sdk` installed

## Phase 1: Hardware Setup

### Connect Both Arms

```bash
ls /dev/tty.usbmodem*
```

Two ports should appear — one for the leader, one for the follower.

### Calibrate (CLI)

```bash
so101-calibrate --type leader --port /dev/tty.usbmodemXXX --id leader1
so101-calibrate --type follower --port /dev/tty.usbmodemYYY --id follower1
```

### Calibrate (Dashboard)

1. Open your environment in the Cyberwave dashboard
2. Select the SO-101 twin and click **Calibrate**
3. Move each joint through its full range when prompted
4. Repeat for both leader and follower arms

## Phase 2: Record Teleoperation Data

### Via Cyberwave Dashboard

1. Open your environment and switch to **Live Mode**
2. Turn on the camera (click the camera icon → **Turn On**)
3. Click **Start Recording**
4. Perform the task with the leader arm (the follower mirrors movements)
5. Repeat 10–15 times with slight variations for dataset diversity
6. Click **Stop Recording**

> Recording captures both arm joint positions and camera feed simultaneously.

### Via Direct Serial (macOS fallback)

If the Docker driver cannot access USB (macOS limitation), record locally:

```python
from scservo_sdk import *
import time
import json
import csv

PORT = "/dev/tty.usbmodem5AE60824111"
BAUDRATE = 1000000
ADDR_PRESENT_POSITION = 56

port_handler = PortHandler(PORT)
packet_handler = PacketHandler(0)
port_handler.openPort()
port_handler.setBaudRate(BAUDRATE)

recording = []
print("Recording... Press Ctrl+C to stop.")

try:
    while True:
        frame = {"timestamp": time.time(), "joints": {}}
        for motor_id in range(1, 7):
            pos, _, _ = packet_handler.read2ByteTxRx(
                port_handler, motor_id, ADDR_PRESENT_POSITION
            )
            frame["joints"][str(motor_id)] = pos
        recording.append(frame)
        time.sleep(0.05)  # 20 Hz
except KeyboardInterrupt:
    pass

port_handler.closePort()

# Save to file
with open("recording.json", "w") as f:
    json.dump(recording, f, indent=2)

print("Saved %d frames to recording.json" % len(recording))
```

## Phase 3: Create Dataset

### Via Dashboard

1. Open the recorded session in your environment
2. Review the timeline with video and telemetry data
3. Trim each episode to isolate a single task completion (start → finish)
4. Remove failed attempts or pauses
5. Optionally label episodes
6. Navigate to **Manage Datasets**
7. Select episodes to include
8. Click **Create Dataset**

### Local Dataset Format

For locally recorded data, structure as:

```
dataset/
├── episode_001.json
├── episode_002.json
├── ...
└── metadata.json
```

Each episode file contains timestamped joint positions and (optionally) camera frame paths.

## Phase 4: Train the Model

### Via Cyberwave Dashboard

1. Go to the training interface
2. Select your **workspace**
3. Choose an **ML model** architecture
4. Select the **dataset** created in Phase 3
5. Configure training settings:
   - **Data Augmentation**: 0 (none), 1 (low, recommended), or 2 (medium)
   - **Training Stop Policy**:
     - "Save best model until N iterations" (max 5000)
     - "Stop when validation loss is under threshold"
6. Click **Start Training**
7. Monitor training progress in the dashboard

> Data augmentation adds variations to training data to help the model generalize to new situations.

## Phase 5: Deploy the Model

### Assign as Controller

1. Navigate to **AI → Deployments**
2. Click **Start New Deployment**
3. Select the completed trained model
4. Select the target SO-101 digital twin
5. Click **Deploy**

### Run Autonomous Tasks

1. Switch environment to **Edit Mode**
2. Click **Assign Controller Policy**
3. Select the deployed model
4. Click **Save Configuration**
5. Switch to **Live View**
6. Enter a natural language prompt (e.g., "Pick up the object and place it in the box")
7. The model executes the task autonomously on the physical arm

## Tips

- Record at least 10–15 demonstrations per task for reliable training
- Vary object positions and orientations between episodes
- Keep demonstrations consistent in speed and technique
- Start with simple tasks (pick and place) before complex ones
- Use data augmentation level 1 for most use cases

## References

- [Cyberwave SO-101 Get Started](https://docs.cyberwave.com/hardware/so101/get-started)
- [Cyberwave Python SDK](https://docs.cyberwave.com/sdks/python-sdk)
- [Direct Serial Control Guide](../move-so-101.md)
