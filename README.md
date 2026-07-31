<p align="center">
  <img src="client/public/favicon.svg" alt="Vault Siege" width="80" />
</p>

<h1 align="center">Vault Siege</h1>

<p align="center">
  <strong>A state-driven, multi-era puzzle gateway for Computer Engineering orientation events.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square" alt="Node" />
  <img src="https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/express-5-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
</p>

---

## Overview

A sequential gateway application where the backend holds the single source of truth for global state. As groups solve puzzles, the state index increments and **every connected client instantly morphs** to match the new era — all participants see the exact same interface at all times.

---

## Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Era Sequence](#era-sequence)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Adding a New Puzzle](#adding-a-new-puzzle)
- [License](#license)

---

## Architecture

```
┌──────────────────────────┐     Polls every 2s       ┌──────────────────────────────┐
│     Express Backend      │ ◄── GET /system-state ── │     React / Vite Frontend    │
│     (Port 5000)          │                          │     (Port 5173)              │
│                          │                          │                              │
│  systemLayers[] → index  │ ◄── POST /bypass-layer → │  App.jsx switch(themeState)  │
│  puzzleRegistry          │                          │    ├─ MechanicalView (ERA 1) │
│  activeUsers Map (siege) │ ◄── POST /siege-ping ──  │    ├─ AnalogView     (ERA 2) │
│  config.js (rate/attack) │ ◄── GET /config-status ─ │    ├─ OpenSourceView (ERA 3) │
│                          │                          │    ├─ CloudSiegeView (ERA 4) │
└──────────────────────────┘                          │    └─ WelcomeScreen  (FINAL) │
                                                      └──────────────────────────────┘
```

**Core concepts:**

| Concept | Description |
|---------|-------------|
| **State Array** | `systemLayers` in `server/index.js` — a linear array with a mutable `activeLayerIndex` |
| **Polling Engine** | `App.jsx` pings `/api/v1/system-state` every 2 s and renders the matching component |
| **Plugin Registry** | `puzzleRegistry.js` maps layer IDs to isolated validation modules |
| **Config Bridge** | `server/config.js` — ERA 3 requires participants to modify this via a PR |

---

## Project Structure

```
26_Com_Welcome/
│
├── server/                           # ── Backend ──
│   ├── index.js                      # Express app — state machine, API routes, heartbeat
│   ├── config.js                     # Mutable config (ERA 3 puzzle target)
│   ├── package.json                  # Server deps (express, cors)
│   └── puzzles/                      # Puzzle validation modules
│       ├── puzzleRegistry.js         # Central lookup — maps layer IDs → validators
│       ├── era1-punchcards.js        # Validates: "LAB03_SHELF2"
│       ├── era2-audio.js             # Validates: "harmonics_440hz"
│       ├── era3-github.js            # Validates: config flag check
│       └── era4-siege.js             # Validates: "OVERLOAD_CORE_2026"
│
├── client/                           # ── Frontend ──
│   ├── index.html                    # HTML entry
│   ├── package.json                  # Client deps (react, tailwindcss v3, vite)
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── main.jsx                  # App entry point
│       ├── App.jsx                   # State polling + theme-based component switch
│       ├── index.css                 # Tailwind directives
│       └── components/
│           ├── MechanicalView.jsx    # ERA 1 — Punchcard decoder
│           ├── AnalogView.jsx        # ERA 2 — Audio spectrogram
│           ├── OpenSourceView.jsx    # ERA 3 — Terminal UI, polls config-status
│           ├── CloudSiegeView.jsx    # ERA 4 — Heartbeat pinger
│           └── WelcomeScreen.jsx     # Final — "System Accessed" celebration
│
├── .vscode/
│   └── settings.json                 # Suppresses CSS @tailwind lint warnings
├── .gitignore
├── LICENSE
└── README.md
```

---

## Era Sequence

| # | Layer ID | Theme | Component | Puzzle |
|---|----------|-------|-----------|--------|
| 0 | `punchcards` | `ERA_MECHANICAL` | `MechanicalView` | Decode Hollerith punchcards → submit `LAB03_SHELF2` |
| 1 | `audio` | `ERA_ANALOG` | `AnalogView` | Analyze distorted audio in a spectrogram → submit `harmonics_440hz` |
| 2 | `github` | `ERA_OPEN_SOURCE` | `OpenSourceView` | Fork repo, set `ATTACK_MODE_ENABLED=true` & `MAX_RATE_LIMIT≥200` in `server/config.js`, submit PR |
| 3 | `siege` | `ERA_CLOUD_SIEGE` | `CloudSiegeView` | Keep 200 concurrent browser connections alive via heartbeat |
| 4 | `unlocked` | `SYSTEM_ACCESSED` | `WelcomeScreen` | 🎉 Celebration — no puzzle |

### ERA 3 → ERA 4 Transition

1. `OpenSourceView` polls `GET /api/v1/config-status` every 3 s.
2. When `attackMode === true` AND `rateLimit >= 200`, the frontend auto-submits the bypass.
3. `era3-github.js` validates and advances to `ERA_CLOUD_SIEGE`.

### ERA 4 (Siege) Mechanics

1. Each browser generates a random `clientId` on mount.
2. `CloudSiegeView` pings `POST /api/v1/siege-ping` every 2 s.
3. Server prunes clients that haven't pinged within 5 s.
4. When `activeConnections >= 200`, state advances to `SYSTEM_ACCESSED`.

---

## API Reference

### `GET /api/v1/system-state`

Returns the current global state. Polled by all clients.

```json
{
  "currentLayer": { "id": "punchcards", "theme": "ERA_MECHANICAL" },
  "layerIndex": 0,
  "metrics": null
}
```

On the `siege` layer, `metrics` includes `{ "activeConnections": 42, "targetThreshold": 200 }`.

### `POST /api/v1/bypass-layer`

Submit a puzzle answer.

| Field | Type | Description |
|-------|------|-------------|
| `submission` | `string \| object` | The puzzle answer |

**200** → `{ "status": "STATE UPGRADED", "nextLayer": {...} }`
**400** → `{ "status": "DENIED", "message": "..." }`

### `POST /api/v1/siege-ping`

ERA 4 heartbeat. Registers/refreshes a client connection.

| Field | Type | Description |
|-------|------|-------------|
| `clientId` | `string` | Unique browser identifier |

### `GET /api/v1/config-status`

Exposes live `server/config.js` values (cache-busted). Polled during ERA 3.

```json
{ "attackMode": true, "rateLimit": 200 }
```

---

## Getting Started

### Prerequisites

- Node.js v18+

### Install

```bash
git clone https://github.com/DidulaKaru/26_Com_Welcome.git
cd 26_Com_Welcome

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Run

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd server
npm start
# → Vault Engine running on port 5000

# Terminal 2 — Frontend
cd client
npm run dev
# → http://localhost:5173/
```

For auto-restart on file changes:

```bash
cd server
npm run dev   # node --watch index.js
```

---

## Configuration

### Environment Variables

| Variable | Location | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | Server | `5000` | Backend port |
| `VITE_API_URL` | `client/.env` | `http://localhost:5000` | API base URL for frontend |

For LAN deployment, update `VITE_API_URL` to the server's accessible address (e.g. `http://192.168.1.100:5000`).

### Puzzle Config (`server/config.js`)

```js
module.exports = {
    MAX_RATE_LIMIT: 1,            // ERA 3 target: change to >= 200
    ATTACK_MODE_ENABLED: false    // ERA 3 target: change to true
};
```

---

## Adding a New Puzzle

### 1. Create the validator

```js
// server/puzzles/era5-networking.js
module.exports = {
    validate: (submission) => {
        if (submission?.trim().toUpperCase() === "SUBNET_MASK_255") {
            return { success: true };
        }
        return { success: false, message: "Invalid network configuration." };
    }
};
```

### 2. Register it

```js
// server/puzzles/puzzleRegistry.js
const era5Networking = require('./era5-networking');

const puzzles = {
    // ... existing
    "networking": era5Networking
};
```

### 3. Add the layer

```js
// server/index.js — insert before "unlocked"
{ id: "networking", theme: "ERA_NETWORKING" },
```

### 4. Create the frontend view

Create `client/src/components/NetworkingView.jsx`, then add the case in `App.jsx`:

```jsx
case "ERA_NETWORKING":
    return <NetworkingView onBreach={fetchState} />;
```

---

## Resolved Issues

| Issue | Resolution |
|-------|-----------|
| ERA 3 payload shape mismatch | `OpenSourceView` sends `{ attackModeEnabled, maxRateLimit }` matching `era3-github.js` |
| ERA 3 threshold mismatch | `era3-github.js` accepts `maxRateLimit >= 200` |
| `config.js` cached by `require()` | `/config-status` busts cache via `delete require.cache` |
| Hardcoded `localhost` URLs | All fetch calls use `import.meta.env.VITE_API_URL` with fallback |
| Siege threshold coupled to config | Hardcoded `targetThreshold: 200` in server, fully decoupled |

---

## License

[MIT](LICENSE)