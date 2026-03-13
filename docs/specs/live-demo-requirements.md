# Live Demo Page Requirements

## 1. Overview

Add a `/demo/:scenarioId` route to the existing React frontend that displays a live camera feed from the backend and allows the user to trigger a robot arm sorting action with a single button press.

## 2. System Flow

```
User visits /demo/2
       |
       v
[Frontend displays live MJPEG stream]
  <img src="{BACKEND_URL}/api/so-01/stream" />
       |
       v
[User clicks "Clearing" button]
       |
       v
POST {BACKEND_URL}/api/so-01/2
       |
       v
[Robot arm plays scenario 2]
       |
       v
[Frontend polls GET {BACKEND_URL}/api/so-01/status]
[Shows progress until playback completes]
```

## 3. Environment Configuration

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_BACKEND_URL` | `https://xxxx.ngrok-free.app` | Backend API base URL |

Set in `frontend/.env`:
```
VITE_BACKEND_URL=http://localhost:8000
```

## 4. Route

```
/demo/:scenarioId
```

- `scenarioId` is extracted from the URL path parameter (e.g., `/demo/2` → scenario 2)
- If the scenario ID is missing or invalid, display an error state

## 5. UI Layout

```
┌─────────────────────────────────────────┐
│  ← Back to home                         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │     Live Camera Feed            │    │
│  │     (MJPEG stream, 16:9)       │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│        [ ● Clearing ]  ← button         │
│                                         │
│     Status: idle / playing / done       │
│     Progress bar (when playing)         │
│                                         │
└─────────────────────────────────────────┘
```

## 6. Components & Behavior

### 6.1 Live Camera Stream

- Rendered as `<img src="{VITE_BACKEND_URL}/api/so-01/stream" />`
- Aspect ratio: 16:9
- If the stream fails to load, show a fallback "Camera offline" state

### 6.2 Clearing Button

- Label: "Clearing"
- On click: `POST {VITE_BACKEND_URL}/api/so-01/{scenarioId}`
- Disabled while a scenario is playing (status === "playing")
- Visual states:
  - **Idle**: Default accent-colored button
  - **Playing**: Disabled with loading spinner, shows "Running..."
  - **Done**: Brief success state, then returns to idle

### 6.3 Status & Progress

- After triggering playback, poll `GET {VITE_BACKEND_URL}/api/so-01/status` every 500ms
- Display:
  - Current status (idle / playing)
  - Progress bar showing `progress_percent`
  - Frame counter: `current_frame / total_frames`
- Stop polling when status returns to "idle"

## 7. Error Handling

| HTTP Status | Meaning | UI Behavior |
|-------------|---------|-------------|
| 404 | Scenario not found | Show "Scenario not found" message |
| 409 | Already playing | Show "Already running" message |
| 503 | Robot not connected | Show "Robot offline" message |

## 8. Tech Stack

- React + TypeScript (existing)
- React Router DOM (existing) — dynamic route param
- Tailwind CSS (existing) — styling
- Motion (existing) — animations
- No additional dependencies required

## 9. File Changes

| File | Change |
|------|--------|
| `frontend/.env` | Add `VITE_BACKEND_URL` |
| `frontend/src/App.tsx` | Add `/demo/:scenarioId` route |
| `frontend/src/components/LiveDemoPage.tsx` | New component |
