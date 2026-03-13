"""
SO-101 Scenario Replay API

Usage:
    cd so-101
    uvicorn api.main:app --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .player import Player

app = FastAPI(title="SO-101 Scenario Replay API")

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

player = Player()


@app.get("/api/so-01/scenarios")
def list_scenarios():
    return {"scenarios": player.list_scenarios()}


@app.get("/api/so-01/status")
def get_status():
    return player.get_status()


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
