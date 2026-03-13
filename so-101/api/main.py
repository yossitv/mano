"""
SO-101 Scenario Replay API

Usage:
    cd so-101
    uvicorn api.main:app --host 0.0.0.0 --port 8000
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse

from .camera import Camera
from .player import Player

player = Player()
camera = Camera(
    device=int(os.environ.get("CAMERA_DEVICE", "0")),
    width=int(os.environ.get("CAMERA_WIDTH", "1920")),
    height=int(os.environ.get("CAMERA_HEIGHT", "1080")),
    fps=int(os.environ.get("CAMERA_FPS", "30")),
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: open camera
    try:
        camera.open()
    except RuntimeError:
        pass  # camera may not be connected; stream endpoints will return 503
    yield
    # Shutdown: release camera
    camera.close()


app = FastAPI(title="SO-101 Scenario Replay API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://.*\.ngrok-free\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/so-01/scenarios")
def list_scenarios():
    return {"scenarios": player.list_scenarios()}


@app.get("/api/so-01/status")
def get_status():
    return player.get_status()


# ── Camera stream endpoints (must be before {scenario_id} catch-all) ─


@app.get("/api/so-01/stream")
async def video_stream():
    """MJPEG live stream. Use as <img src="..."> or fetch directly."""
    if camera._cap is None or not camera._cap.isOpened():
        raise HTTPException(status_code=503, detail="Camera not available")
    return StreamingResponse(
        camera.stream_mjpeg(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


@app.get("/api/so-01/snapshot")
async def snapshot():
    """Single JPEG frame capture."""
    if camera._cap is None or not camera._cap.isOpened():
        raise HTTPException(status_code=503, detail="Camera not available")
    import asyncio
    frame = await asyncio.to_thread(camera.read_frame)
    if frame is None:
        raise HTTPException(status_code=500, detail="Failed to capture frame")
    return Response(content=frame, media_type="image/jpeg")


# ── Scenario playback (catch-all path param must come last) ──────────


@app.post("/api/so-01/{scenario_id}")
async def play_scenario(scenario_id: int):
    try:
        result = await player.play(scenario_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Scenario %d not found" % scenario_id)
    except RuntimeError as e:
        if "Already playing" in str(e):
            raise HTTPException(status_code=409, detail=str(e))
        raise HTTPException(status_code=503, detail=str(e))
    return result


@app.post("/api/so-01/stop")
async def stop_playback():
    await player.stop()
    return {"status": "stopped"}
