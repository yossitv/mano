# SO-101 Scenario Replay API

Local API server that replays recorded teleoperation scenarios on the SO-101 robot arm. Connect from the frontend via ngrok for remote demo control.

## Architecture

```
Frontend (Vercel) → ngrok → Local API (FastAPI) → USB Serial → SO-101 Arm
```

## Setup

```bash
cd so-101
pip install -r api/requirements.txt
```

## Run

```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

The follower arm serial port is auto-detected. To set it manually:

```bash
FOLLOWER_PORT=/dev/tty.usbmodemXXX uvicorn api.main:app --host 0.0.0.0 --port 8000
```

## Expose via ngrok

```bash
ngrok http 8000
```

Use the generated URL (e.g. `https://xxxx.ngrok-free.app`) in the frontend.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/so-01/scenarios` | List available scenarios |
| GET | `/api/so-01/status` | Get current playback status |
| POST | `/api/so-01/{scenario_id}` | Start playing a scenario |
| POST | `/api/so-01/stop` | Stop current playback |

### Examples

```bash
# List scenarios
curl http://localhost:8000/api/so-01/scenarios

# Play scenario 2
curl -X POST http://localhost:8000/api/so-01/2

# Check status
curl http://localhost:8000/api/so-01/status

# Stop
curl -X POST http://localhost:8000/api/so-01/stop
```

## Data

Recorded episodes are stored in `data/episode_XXX/` (gitignored). Each episode contains:
- `episode.json` — metadata + joint positions at 20Hz
- `frame_XXXXX.jpg` — camera frames
