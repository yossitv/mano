"""
USB camera streaming module.
Provides MJPEG stream and snapshot endpoints via FastAPI.
"""

import asyncio
import time
from contextlib import asynccontextmanager
from typing import Optional

import cv2


class Camera:
    def __init__(self, device: int = 0, width: int = 640, height: int = 480, fps: int = 30):
        self.device = device
        self.width = width
        self.height = height
        self.fps = fps
        self._cap: Optional[cv2.VideoCapture] = None
        self._lock = asyncio.Lock()

    def open(self):
        if self._cap is not None and self._cap.isOpened():
            return
        self._cap = cv2.VideoCapture(self.device)
        self._cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
        self._cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
        self._cap.set(cv2.CAP_PROP_FPS, self.fps)
        if not self._cap.isOpened():
            self._cap = None
            raise RuntimeError("Failed to open camera device %d" % self.device)

    def close(self):
        if self._cap is not None:
            self._cap.release()
            self._cap = None

    def read_frame(self) -> Optional[bytes]:
        """Capture one frame and return as JPEG bytes."""
        if self._cap is None or not self._cap.isOpened():
            return None
        ret, frame = self._cap.read()
        if not ret:
            return None
        _, jpeg = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
        return jpeg.tobytes()

    async def stream_mjpeg(self):
        """Async generator yielding MJPEG multipart frames."""
        interval = 1.0 / self.fps
        while True:
            t0 = time.monotonic()
            frame = await asyncio.to_thread(self.read_frame)
            if frame is None:
                await asyncio.sleep(0.1)
                continue
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n"
                b"Content-Length: %d\r\n\r\n" % len(frame)
                + frame
                + b"\r\n"
            )
            elapsed = time.monotonic() - t0
            if elapsed < interval:
                await asyncio.sleep(interval - elapsed)
