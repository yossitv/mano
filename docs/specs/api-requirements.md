# SO-101 Scenario Replay API Requirements

## 1. Overview

Build a local API server that replays recorded scenarios (episodes) on the SO-101 robot arm.
The frontend connects to this API via ngrok, enabling remote demo operations.

## 2. System Architecture

```
[Frontend (Vercel, etc.)]
       |
    [ngrok]
       |
[Local API Server (Python/FastAPI)]
       |
  [USB Serial]
       |
[SO-101 Follower Arm (Feetech STS3215)]
```

## 3. Tech Stack

| Component | Technology |
|-----------|------------|
| Language | Python 3 |
| Framework | FastAPI |
| Servo Control | feetech-servo-sdk (scservo_sdk) |
| Serial Communication | USB Serial, 1000000 baud |
| ASGI Server | Uvicorn |
| Tunneling | ngrok |

## 4. API Endpoints

### 4.1 Play Scenario

```
POST /api/so-01/{scenario_id}
```

- **Description**: Replay the specified scenario on the follower arm
- **Path Parameters**:
  - `scenario_id` (int): Episode number (e.g., `2`, `3`)
- **Response**:
  ```json
  {
    "status": "playing",
    "scenario_id": 2,
    "frames": 586,
    "duration_sec": 29.3,
    "frequency_hz": 20
  }
  ```
- **Errors**:
  - `404`: Scenario not found
  - `409`: Another scenario is currently playing
  - `503`: Robot arm not connected

### 4.2 Stop Playback

```
POST /api/so-01/stop
```

- **Description**: Stop the currently playing scenario
- **Response**:
  ```json
  {
    "status": "stopped"
  }
  ```

### 4.3 Get Playback Status

```
GET /api/so-01/status
```

- **Description**: Get the current playback state
- **Response**:
  ```json
  {
    "status": "playing" | "idle" | "error",
    "scenario_id": 2,
    "current_frame": 150,
    "total_frames": 586,
    "progress_percent": 25.6
  }
  ```

### 4.4 List Scenarios

```
GET /api/so-01/scenarios
```

- **Description**: Return a list of available scenarios
- **Response**:
  ```json
  {
    "scenarios": [
      {
        "id": 2,
        "frames": 586,
        "duration_sec": 29.3,
        "frequency_hz": 20,
        "recorded_at": "2026-03-14T07:20:14.089055"
      },
      {
        "id": 3,
        "frames": 480,
        "duration_sec": 24.0,
        "frequency_hz": 20,
        "recorded_at": "2026-03-14T08:15:30.123456"
      }
    ]
  }
  ```

## 5. Data Structure

### 5.1 Episode Data (Existing)

Location: `so-101/data/episode_{id}/episode.json`

```json
{
  "episode": 2,
  "frames": 586,
  "frequency_hz": 20,
  "recorded_at": "2026-03-14T07:20:14.089055",
  "leader_port": "/dev/tty.usbmodem5AE60552071",
  "follower_port": "/dev/tty.usbmodem5AE60824111",
  "data": [
    {
      "timestamp": 1773440384.213,
      "frame": 0,
      "leader_joints": { "1": 2105, "2": 914, "3": 3130, "4": 2875, "5": 3109, "6": 1770 },
      "follower_joints": { "1": 2102, "2": 912, "3": 3094, "4": 2876, "5": 3112, "6": 1778 }
    }
  ]
}
```

### 5.2 Motor Configuration

| Motor ID | Joint |
|----------|-------|
| 1 | Base rotation |
| 2 | Shoulder |
| 3 | Elbow |
| 4 | Wrist pitch |
| 5 | Wrist roll |
| 6 | Gripper |

## 6. Playback Logic

1. Load `episode.json`
2. Enable torque on the follower arm
3. Write `follower_joints` data sequentially at `frequency_hz` (20Hz = 50ms intervals)
4. Disable torque after all frames have been played
5. Playback runs as an async background task

## 7. CORS Configuration

Required for frontend access via ngrok:

```python
origins = [
    "https://*.ngrok-free.app",
    "http://localhost:5173",          # Vite dev server
    "https://mano-site.vercel.app"    # Production frontend (TBD)
]
```

## 8. Directory Structure

```
so-101/
├── api/
│   ├── main.py          # FastAPI app + endpoints
│   ├── player.py        # Scenario playback logic (servo control)
│   └── requirements.txt # Python dependencies
├── data/
│   ├── episode_002/
│   └── episode_003/
├── teleop_record.py
└── replay_episode.py
```

## 9. How to Run

```bash
cd so-101
pip install -r api/requirements.txt
uvicorn api.main:app --host 0.0.0.0 --port 8000

# In a separate terminal, start ngrok
ngrok http 8000
```

## 10. Frontend Integration

Example frontend usage:

```typescript
const NGROK_URL = "https://xxxx.ngrok-free.app";

// Play scenario
await fetch(`${NGROK_URL}/api/so-01/2`, { method: "POST" });

// Check status
const res = await fetch(`${NGROK_URL}/api/so-01/status`);
const status = await res.json();
```

## 11. Constraints

- Only one scenario can play at a time
- Returns `503` error if the follower arm is not connected via USB
- Episode data is loaded from the `so-101/data/` directory (gitignored)
- Serial port is configured via environment variable or auto-detection
