# State-Driven Modular Vault Siege

This repository contains the core infrastructure for the **Computer Engineering Orientation Vault Siege**. It is built using a **State Machine Architecture** on an Express backend and a **Dynamic Component Rendering** engine on a React/Vite frontend.

The application functions as a sequential gateway. The backend holds the absolute "truth" of the current global state. As groups solve puzzles, the backend state index increments, and all connected frontend clients instantly morph their UI to match the new era. Every participant sees the exact same interface at all times.

---

## Table of Contents

- [System Architecture](#1-system-architecture)
- [Project Structure](#2-project-structure)
- [Era Sequence & Puzzle Details](#3-era-sequence--puzzle-details)
- [API Reference](#4-api-reference)
- [Getting Started](#5-getting-started)
- [Known Issues & Bugs](#6-known-issues--bugs)
- [How to Add a New Puzzle](#7-how-to-add-a-new-puzzle)

---

## 1. System Architecture

```
┌─────────────────────────────┐       Polls every 2s        ┌─────────────────────────────────┐
│       Express Backend       │ ◄──── GET /system-state ──── │     React/Vite Frontend          │
│       (Port 5000)           │                              │     (Port 5173)                  │
│                             │                              │                                  │
│  systemLayers[] ──► index   │ ◄──── POST /bypass-layer ──► │  App.jsx switch(themeState)       │
│  puzzleRegistry.findPuzzle()│                              │    ├─ MechanicalView (ERA 1)     │
│  activeUsers Map (siege)    │ ◄──── POST /siege-ping ────  │    ├─ AnalogView    (ERA 2)      │
│  config.js (rate/attack)    │ ◄──── GET /config-status ──  │    ├─ OpenSourceView (ERA 3)     │
│                             │                              │    ├─ CloudSiegeView (ERA 4)     │
└─────────────────────────────┘                              │    └─ WelcomeScreen  (FINAL)     │
                                                             └─────────────────────────────────┘
```

### Core Concepts

1. **The State Array (`server.js`)**: A linear array named `systemLayers` defines the sequence of the event. A single mutable `activeLayerIndex` integer tracks the current position globally.
2. **The Polling Engine (`App.jsx`)**: The React frontend pings `GET /api/v1/system-state` every 2 seconds. It does not store its own routing state; it strictly renders whatever UI component matches the server's current `theme` string.
3. **The Plugin Registry (`puzzleRegistry.js`)**: Puzzle logic is strictly separated from the server routing logic. When a user submits an answer via `POST /api/v1/bypass-layer`, the server looks up the active puzzle in the registry and delegates the evaluation to that specific isolated module.
4. **The Config Bridge (`config.js`)**: A shared config file (`config.js`) at the project root controls `MAX_RATE_LIMIT` and `ATTACK_MODE_ENABLED`. Era 3 (Open Source) requires participants to modify these values on the live repository and submit a PR. The frontend polls `GET /api/v1/config-status` to detect the change.

---

## 2. Project Structure

```
26_Com_Welcome/
├── server.js                     # Express backend — state machine, API routes, heartbeat loop
├── config.js                     # Mutable config (ERA 3 puzzle target)
├── package.json                  # Root dependencies (express, cors)
│
├── puzzles/                      # Backend puzzle validation modules
│   ├── puzzleRegistry.js         # Central lookup — maps layer IDs to validators
│   ├── era1-punchcards.js        # Validates: "LAB03_SHELF2"
│   ├── era2-audio.js             # Validates: "harmonics_440hz"
│   ├── era3-github.js            # Validates: { attackModeEnabled: true, maxRateLimit: >= 200 }
│   └── era4-siege.js             # Validates: { overrideKey: "OVERLOAD_CORE_2026" }
│
├── client/                       # React + Vite frontend
│   ├── package.json              # Client dependencies (react, tailwindcss v3, vite)
│   ├── .env                      # Environment config (VITE_API_URL)
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx              # App entry point
│       ├── App.jsx               # State polling + theme-based component switch
│       ├── index.css             # Tailwind directives (@tailwind base/components/utilities)
│       └── components/
│           ├── MechanicalView.jsx   # ERA 1 — Punchcard decoder input
│           ├── AnalogView.jsx       # ERA 2 — Audio spectrogram key input
│           ├── OpenSourceView.jsx   # ERA 3 — Terminal UI, polls config-status
│           ├── CloudSiegeView.jsx   # ERA 4 — Heartbeat pinger, live connection counter
│           └── WelcomeScreen.jsx    # Final — "System Accessed" celebration screen
│
├── .gitignore                    # Excludes node_modules, dist, .env, .DS_Store
└── .vscode/
    └── settings.json             # Suppresses CSS @tailwind lint warnings
```

---

## 3. Era Sequence & Puzzle Details

| Index | Layer ID     | Theme              | Component           | Puzzle Mechanic                                                                                                |
|-------|--------------|--------------------|--------------------|----------------------------------------------------------------------------------------------------------------|
| 0     | `punchcards` | `ERA_MECHANICAL`   | `MechanicalView`   | Decode physical Hollerith punchcards via binary-to-ASCII. Submit `LAB03_SHELF2`.                               |
| 1     | `audio`      | `ERA_ANALOG`       | `AnalogView`       | Analyze a distorted audio file in a spectrogram tool. Submit `harmonics_440hz`.                                |
| 2     | `github`     | `ERA_OPEN_SOURCE`  | `OpenSourceView`   | Fork the repo, change `config.js` (`ATTACK_MODE_ENABLED=true`, `MAX_RATE_LIMIT≥200`), submit a PR.            |
| 3     | `siege`      | `ERA_CLOUD_SIEGE`  | `CloudSiegeView`   | Keep browsers open — all participants must maintain a heartbeat. Threshold: 200 concurrent connections.        |
| 4     | `unlocked`   | `SYSTEM_ACCESSED`  | `WelcomeScreen`    | Final celebration state. No puzzle.                                                                           |

### How Era 3 → Era 4 Transition Works

1. `OpenSourceView` polls `GET /api/v1/config-status` every 3 seconds.
2. When the server responds with `attackMode === true` AND `rateLimit >= 200`, the frontend auto-submits `POST /api/v1/bypass-layer` with `{ attackModeEnabled: true, maxRateLimit: 200 }`.
3. `era3-github.js` validates `attackModeEnabled === true && maxRateLimit >= 200` and returns success, advancing the state to `ERA_CLOUD_SIEGE`.

### How Era 4 (Siege) Works

1. Each browser generates a random `clientId` on mount.
2. `CloudSiegeView` sends `POST /api/v1/siege-ping` with `{ clientId }` every 2 seconds.
3. The server stores each `clientId` in an `activeUsers` Map with its last ping timestamp.
4. A 1-second `setInterval` loop on the server prunes any client that hasn't pinged within 5 seconds.
5. When `activeConnections >= targetThreshold`, the `activeLayerIndex` increments to `SYSTEM_ACCESSED`.

---

## 4. API Reference

### `GET /api/v1/system-state`
Returns the current global state. Polled by all clients every 2 seconds.
```json
{
  "currentLayer": { "id": "punchcards", "theme": "ERA_MECHANICAL" },
  "layerIndex": 0,
  "metrics": null
}
```
When on the `siege` layer, `metrics` includes:
```json
{
  "activeConnections": 42,
  "targetThreshold": 200
}
```

### `POST /api/v1/bypass-layer`
Submit a puzzle answer to attempt layer advancement.
- **Body**: `{ "submission": <string | object> }`
- **200**: `{ "status": "STATE UPGRADED", "nextLayer": {...} }`
- **400**: `{ "status": "DENIED", "message": "..." }`

### `POST /api/v1/siege-ping`
Heartbeat endpoint for Era 4. Registers/refreshes a client's connection.
- **Body**: `{ "clientId": "abc123" }`
- **200**: `{ "status": "ACKNOWLEDGED" }`
- **400**: Returned if not currently on the siege layer.

### `GET /api/v1/config-status`
Exposes the live `config.js` values (cache-busted on every request). Polled by `OpenSourceView` during Era 3.
```json
{
  "attackMode": true,
  "rateLimit": 200
}
```

---

## 5. Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/DidulaKaru/26_Com_Welcome.git
cd 26_Com_Welcome

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

### Environment Configuration

The frontend reads the API base URL from a `.env` file in the `client/` directory. A default is already provided:

```env
# client/.env
VITE_API_URL=http://localhost:5000
```

For LAN or production deployment, update this to the server's accessible address (e.g., `http://192.168.1.100:5000`).

### Running

Open **two terminals**:

```bash
# Terminal 1 — Start the backend
node server.js
# Output: Vault Engine running on port 5000

# Terminal 2 — Start the frontend
cd client
npm run dev
# Output: http://localhost:5173/
```

---

## 6. Resolved Issues Changelog

All previously identified issues have been resolved. Below is a log of what was fixed.

| Issue | Resolution |
|---|---|
| Era 3 payload shape mismatch (`overrideKey` vs `attackModeEnabled`) | `OpenSourceView` now sends `{ attackModeEnabled: true, maxRateLimit: 200 }` matching `era3-github.js` |
| Era 3 `maxRateLimit` threshold mismatch (5000 vs 200) | `era3-github.js` updated to accept `maxRateLimit >= 200` |
| Era 3 config gate condition removed (bypass fired unconditionally) | Conditional `if (data.attackMode === true && data.rateLimit >= 200)` restored in `OpenSourceView` |
| `config.js` shipped with post-solve values | Reset to `MAX_RATE_LIMIT: 1`, `ATTACK_MODE_ENABLED: false` (event-ready) |
| Siege threshold coupled to `config.MAX_RATE_LIMIT` | Hardcoded to `targetThreshold: 200` in `server.js`, fully decoupled |
| `config.js` cached by `require()` — no live reload | `/api/v1/config-status` now busts the cache via `delete require.cache` before re-requiring |
| Hardcoded `localhost:5000` URLs in all components | All fetch calls use `import.meta.env.VITE_API_URL` with `localhost:5000` fallback. `.env` file added to `client/` |
| No `.gitignore` file | Added `.gitignore` with `node_modules/`, `client/dist/`, `.env`, `.DS_Store` |
| Unused `App.css` leftover from Vite scaffold | Deleted |

---

## 7. How to Add a New Puzzle

To add a new era/layer to the event, update both the backend logic and the frontend UI.

### Backend

**Step 1: Create the Validation Module**

Create a new file in `puzzles/` (e.g., `puzzles/era5-networking.js`). Export a single `validate` function:

```javascript
// puzzles/era5-networking.js
module.exports = {
    validate: (submission) => {
        const normalized = submission?.trim().toUpperCase();
        if (normalized === "SUBNET_MASK_255") {
            return { success: true };
        }
        return { success: false, message: "Invalid network configuration." };
    }
};
```

**Step 2: Register the Puzzle**

Add it to `puzzles/puzzleRegistry.js`:

```javascript
const era5Networking = require('./era5-networking');

const puzzles = {
    // ... existing entries
    "networking": era5Networking
};
```

**Step 3: Add the Layer to the State Array**

Insert the new layer into `systemLayers` in `server.js` (before `unlocked`):

```javascript
const systemLayers = [
    // ... existing layers
    { id: "networking", theme: "ERA_NETWORKING" },
    { id: "unlocked", theme: "SYSTEM_ACCESSED" }
];
```

### Frontend

**Step 4: Create the View Component**

Create `client/src/components/NetworkingView.jsx` with the themed UI and submission form.

**Step 5: Register in App.jsx**

Add the import and a new `case` in the `switch(themeState)` block:

```jsx
import NetworkingView from './components/NetworkingView';

// Inside the switch:
case "ERA_NETWORKING":
    return <NetworkingView onBreach={fetchState} />;
```