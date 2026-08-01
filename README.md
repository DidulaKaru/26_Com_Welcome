<h1 align="center">Vault Siege</h1>

<p align="center">
  <strong>A state-driven, 7-layer puzzle gateway for Computer Engineering orientation event</strong>
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
- [Deployment Testing (5 Devices)](#deployment-testing-5-devices)
- [Adding a New Puzzle](#adding-a-new-puzzle)
- [Resolved Issues](#resolved-issues)
- [License](#license)

---

## Architecture

```
┌──────────────────────────┐     Polls every 2s       ┌──────────────────────────────┐
│     Express Backend      │ ◄── GET /system-state ── │     React / Vite Frontend    │
│     (Port 5000)          │                          │     (Port 5173)              │
│                          │                          │                              │
│  systemLayers[7] → idx   │ ◄── POST /bypass-layer → │  App.jsx switch(themeState)  │
│  puzzleRegistry          │                          │    ├─ MechanicalView (ERA 0) │
│  siegeMetrics             │                          │    ├─ HashView       (ERA 1) │
│  activeUsers Map (siege) │ ◄── POST /siege-ping ──  │    ├─ BookView       (ERA 2) │
│  config.js (rate/attack) │ ◄── GET /config-status ─ │    ├─ MorseView      (ERA 3) │
│                          │                          │    ├─ OpenSourceView (ERA 4) │
│                          │                          │    ├─ CloudSiegeView (ERA 5) │
└──────────────────────────┘                          │    └─ WelcomeScreen  (FINAL) │
                                                      └──────────────────────────────┘
```

**Core concepts:**

| Concept | Description |
|---------|-------------|
| **State Array** | `systemLayers` in `server/index.js` — a 7-element array with a mutable `activeLayerIndex` |
| **Polling Engine** | `App.jsx` pings `/api/v1/system-state` every 2 s and renders the matching component |
| **Plugin Registry** | `puzzleRegistry.js` maps layer IDs to isolated validation modules |
| **Config Bridge** | `server/config.js` — ERA 4 requires participants to modify this via a GitHub PR |
| **Siege Threshold** | `process.env.SIEGE_LIMIT` (default `275`) — tunable concurrent-user target for ERA 5 |

---

## Project Structure

```
26_Com_Welcome/
│
├── server/                           # ── Backend ──
│   ├── index.js                      # Express app — 7-state machine, API routes, siege heartbeat
│   ├── config.js                     # Mutable config (ERA 4 puzzle target)
│   ├── package.json                  # Server deps (express, cors)
│   └── puzzles/                      # Puzzle validation modules
│       ├── puzzleRegistry.js         # Central lookup — maps layer IDs → validators
│       ├── era1-punchcards.js        # Validates: "D:\Nothing\.git\config"
│       ├── era2-hash.js              # Validates: "53473546F42BA506" (case-insensitive)
│       ├── era3-book.js              # Validates: "10.50.80.5"
│       ├── era4-morse.js             # Validates: "NCC" (case-insensitive)
│       ├── era5-github.js            # Validates: { attackModeEnabled: true, maxRateLimit: ≥200 }
│       └── era6-siege.js             # Emergency override: { overrideKey: "OVERLOAD_CORE_2026" }
│
├── client/                           # ── Frontend ──
│   ├── index.html                    # HTML entry
│   ├── .env                          # VITE_API_URL=http://localhost:5000
│   ├── package.json                  # Client deps (react 19, tailwindcss v3, vite)
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   ├── puzzle.c                  # Downloadable C script (ERA 1 → ERA 2 bridge)
│   │   └── Go Ahead Open This.bat   # Final clue batch executable (ERA 6 reward)
│   └── src/
│       ├── main.jsx                  # App entry point
│       ├── App.jsx                   # State polling + theme-based component switch
│       ├── index.css                 # Tailwind directives
│       └── components/
│           ├── MechanicalView.jsx    # ERA 0 — Punchcard decoder
│           ├── HashView.jsx          # ERA 1 — Cryptographic hash gate (downloads puzzle.c)
│           ├── BookView.jsx          # ERA 2 — Literary cross-reference → IPv4
│           ├── MorseView.jsx         # ERA 3 — Hardware Morse signal decode
│           ├── OpenSourceView.jsx    # ERA 4 — GitHub PR terminal (polls config-status)
│           ├── CloudSiegeView.jsx    # ERA 5 — Distributed siege heartbeat pinger
│           └── WelcomeScreen.jsx     # FINAL — Celebration + batch file download
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
| 0 | `punchcards` | `ERA_MECHANICAL` | `MechanicalView` | Decode physical Hollerith punchcards → submit `D:\Nothing\.git\config` |
| 1 | `hash` | `ERA_HASH` | `HashView` | Download `puzzle.c`, compile & run 50M iterations → submit `53473546F42BA506` |
| 2 | `book` | `ERA_ARCHIVE` | `BookView` | Cross-reference 4 physical book excerpts → submit IPv4 `10.50.80.5` |
| 3 | `morse` | `ERA_MORSE` | `MorseView` | Decode Morse from hardware breadboard → submit `NCC` |
| 4 | `github` | `ERA_OPEN_SOURCE` | `OpenSourceView` | Fork repo, set `ATTACK_MODE_ENABLED=true` & `MAX_RATE_LIMIT=200` in `config.js`, submit PR |
| 5 | `siege` | `ERA_CLOUD_SIEGE` | `CloudSiegeView` | Keep enough concurrent browser connections alive to hit the threshold |
| 6 | `unlocked` | `SYSTEM_ACCESSED` | `WelcomeScreen` | 🎉 Celebration — download `Go Ahead Open This.bat` |

### ERA 4 → ERA 5 Transition (GitHub / Open Source)

1. `OpenSourceView` polls `GET /api/v1/config-status` every 3 s.
2. When `attackMode === true` AND `rateLimit >= 200`, the frontend auto-submits the bypass payload.
3. `era5-github.js` validates `{ attackModeEnabled: true, maxRateLimit: 200 }` and advances to `ERA_CLOUD_SIEGE`.

### ERA 5 (Siege) Mechanics

1. Each browser generates a random `clientId` on mount.
2. `CloudSiegeView` pings `POST /api/v1/siege-ping` every 2 s.
3. The server prunes clients that haven't pinged within 5 s.
4. When `activeConnections >= targetThreshold`, state advances to `SYSTEM_ACCESSED`.
5. `targetThreshold` is set by `process.env.SIEGE_LIMIT` (default: `275`).

---

## API Reference

### `GET /api/v1/system-state`

Returns the current global state. Polled by all clients every 2 s.

```json
{
  "currentLayer": { "id": "punchcards", "theme": "ERA_MECHANICAL" },
  "layerIndex": 0,
  "metrics": null
}
```

On the `siege` layer, `metrics` includes:

```json
{ "activeConnections": 3, "targetThreshold": 5 }
```

### `POST /api/v1/bypass-layer`

Submit a puzzle answer.

| Field | Type | Description |
|-------|------|-------------|
| `submission` | `string \| object` | The puzzle answer |

**200** → `{ "status": "STATE UPGRADED", "nextLayer": {...} }`  
**400** → `{ "status": "DENIED", "message": "..." }`

### `POST /api/v1/siege-ping`

ERA 5 heartbeat. Registers/refreshes a client connection.

| Field | Type | Description |
|-------|------|-------------|
| `clientId` | `string` | Unique browser identifier |

### `GET /api/v1/config-status`

Exposes live `server/config.js` values (cache-busted via `delete require.cache`). Polled during ERA 4.

```json
{ "attackMode": false, "rateLimit": 1 }
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
| `SIEGE_LIMIT` | Server | `275` | Number of concurrent connections required to clear ERA 5 |
| `VITE_API_URL` | `client/.env` | `http://localhost:5000` | API base URL for frontend |

For LAN deployment, update `VITE_API_URL` to the server's accessible address (e.g. `http://192.168.1.100:5000`).

### Puzzle Config (`server/config.js`)

Before the event, ensure this file is reset to its default (locked) state:

```js
module.exports = {
    MAX_RATE_LIMIT: 1,            // ERA 4 target: participants change to >= 200
    ATTACK_MODE_ENABLED: false    // ERA 4 target: participants change to true
};
```

> **Important:** The ERA 4 (GitHub) puzzle requires participants to modify this file themselves via a Pull Request. If it ships with `true` / `200`, the `OpenSourceView` auto-bypasses immediately and ERA 4 is skipped.

---

## Deployment Testing (5 Devices)

Use this workflow to run through the entire 7-state sequence with just **5 physical devices** (phones, laptops, tablets — anything with a browser).

### 1. Pre-flight: Reset `config.js`

Make sure `server/config.js` is in its default locked state before starting:

```js
module.exports = {
    MAX_RATE_LIMIT: 1,
    ATTACK_MODE_ENABLED: false
};
```

### 2. Start the Server with a Low Siege Threshold

Instead of the production default of 275 connections, set `SIEGE_LIMIT=5` so only 5 devices are needed to clear ERA 5.

**PowerShell:**

```powershell
cd server
$env:SIEGE_LIMIT=5; npm start
```

**Bash / macOS / Linux:**

```bash
cd server
SIEGE_LIMIT=5 npm start
```

The server will print:

```
Vault Engine running on port 5000
```

### 3. Start the Frontend

In a second terminal:

```bash
cd client
npm run dev
```

### 4. Connect All Devices

Find the server machine's LAN IP (e.g. `192.168.1.100`). Update `client/.env` if needed:

```
VITE_API_URL=http://192.168.1.100:5000
```

On each device, open the frontend URL (e.g. `http://192.168.1.100:5173`).

> **Tip:** If using Vite's dev server, start it with `npx vite --host` so it binds to `0.0.0.0` and is accessible on the LAN.

### 5. Walk Through Each ERA

| Step | ERA | What to do |
|------|-----|-----------|
| **1** | ERA 0 — Mechanical | On any device, type `D:\Nothing\.git\config` and submit. All screens morph to ERA 1. |
| **2** | ERA 1 — Hash | Submit `53473546F42BA506`. All screens morph to ERA 2. |
| **3** | ERA 2 — Archive | Submit `10.50.80.5`. All screens morph to ERA 3. |
| **4** | ERA 3 — Morse | Submit `NCC`. All screens morph to ERA 4. |
| **5** | ERA 4 — GitHub | Edit `server/config.js` — set `ATTACK_MODE_ENABLED: true` and `MAX_RATE_LIMIT: 200`. Save the file. Within 3 seconds, `OpenSourceView` detects the change via polling and auto-triggers the bypass. All screens morph to ERA 5. |
| **6** | ERA 5 — Siege | Keep all 5 device browsers open. Each device sends a heartbeat every 2 s. Within ~5 s, the server's 1-second interval detects `activeConnections >= 5` and advances. All screens morph to the final state. |
| **7** | FINAL | `WelcomeScreen` renders on all devices. Verify the **"DOWNLOAD FINAL CLUE"** button links to `/Go Ahead Open This.bat` and the file downloads correctly. |

### 6. Verify the Download

On any device, click the download button. The file `Go Ahead Open This.bat` should download and, when run on Windows, display a cinematic PowerShell sequence ending with the final directive.

### Quick Reset

To restart the full sequence without restarting the server, you'll need to restart the Node process (since `activeLayerIndex` is in-memory). Simply stop and re-run:

```powershell
# Ctrl+C to stop, then:
$env:SIEGE_LIMIT=5; npm start
```

Also remember to reset `config.js` back to its defaults before re-testing ERA 4.

---

## Adding a New Puzzle

### 1. Create the validator

```js
// server/puzzles/era7-networking.js
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
const era7Networking = require('./era7-networking');

const puzzles = {
    // ... existing
    "networking": era7Networking
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
|-------|------------|
| `App.jsx` missing 3 component imports | Added `HashView`, `BookView`, `MorseView` imports and switch cases for `ERA_HASH`, `ERA_ARCHIVE`, `ERA_MORSE` |
| `era2-hash.js` permanently unpassable | Changed `.toLowerCase()` → `.toUpperCase()` to match uppercase `EXPECTED_HASH` constant |
| ERA 5 payload shape mismatch | `OpenSourceView` sends `{ attackModeEnabled, maxRateLimit }` matching `era5-github.js` |
| ERA 5 threshold mismatch | `era5-github.js` accepts `maxRateLimit >= 200` |
| `config.js` cached by `require()` | `/config-status` busts cache via `delete require.cache` |
| Hardcoded `localhost` URLs | All fetch calls use `import.meta.env.VITE_API_URL` with fallback |
| Siege threshold not configurable | Uses `process.env.SIEGE_LIMIT` with fallback of `275` |

---

## License

[MIT](LICENSE)