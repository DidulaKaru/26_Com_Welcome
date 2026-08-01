const express = require('express');
const cors = require('cors');
const puzzleRegistry = require('./puzzles/puzzleRegistry');
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

// 7-State Sequence based on the updated orientation plan
const systemLayers = [
    { id: "punchcards", theme: "ERA_MECHANICAL" },
    { id: "hash", theme: "ERA_HASH" },
    { id: "book", theme: "ERA_ARCHIVE" },
    { id: "morse", theme: "ERA_MORSE" },
    { id: "github", theme: "ERA_OPEN_SOURCE" },
    { id: "siege", theme: "ERA_CLOUD_SIEGE" },
    { id: "unlocked", theme: "SYSTEM_ACCESSED" }
];

let activeLayerIndex = 0;

// Locate this block in server/index.js
let siegeMetrics = {
    activeConnections: 0,
    // Pull from environment, fallback to 275 for the live event
    targetThreshold: parseInt(process.env.SIEGE_LIMIT) || 275
};

// I meant to have a .env file for the siege limit. Check if this works

const activeUsers = new Map();

setInterval(() => {
    if (systemLayers[activeLayerIndex]?.id !== "siege") return;

    const now = Date.now();
    let currentActiveCount = 0;

    for (let [clientId, lastPing] of activeUsers.entries()) {
        if (now - lastPing > 5000) {
            activeUsers.delete(clientId);
        } else {
            currentActiveCount++;
        }
    }

    siegeMetrics.activeConnections = currentActiveCount;

    if (currentActiveCount >= siegeMetrics.targetThreshold) {
        activeLayerIndex++; // Globally upgrade to SYSTEM_ACCESSED (State 6)
    }
}, 1000);

// Status and state reporting endpoint
app.get('/api/v1/system-state', (req, res) => {
    res.json({
        currentLayer: systemLayers[activeLayerIndex],
        layerIndex: activeLayerIndex,
        metrics: systemLayers[activeLayerIndex]?.id === "siege" ? siegeMetrics : null
    });
});

// Config status endpoint for Era 4 (GitHub) with cache busting
app.get('/api/v1/config-status', (req, res) => {
    try {
        const configPath = require.resolve('./config.js');
        delete require.cache[configPath];
        const liveConfig = require('./config.js');

        res.json({
            attackMode: liveConfig.ATTACK_MODE_ENABLED,
            rateLimit: liveConfig.MAX_RATE_LIMIT
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to read configuration" });
    }
});

// Heartbeat ping endpoint for the Siege
app.post('/api/v1/siege-ping', (req, res) => {
    if (systemLayers[activeLayerIndex]?.id !== "siege") {
        return res.status(400).json({ status: "DENIED", message: "Siege endpoint is offline." });
    }

    const { clientId } = req.body;
    if (clientId) {
        activeUsers.set(clientId, Date.now());
    }

    res.json({ status: "ACKNOWLEDGED" });
});

// Dynamic puzzle gatekeeper
app.post('/api/v1/bypass-layer', (req, res) => {
    const { submission } = req.body;
    const activeLayer = systemLayers[activeLayerIndex];

    if (!activeLayer || activeLayer.id === "unlocked") {
        return res.json({ status: "COMPLETE", theme: "SYSTEM_ACCESSED" });
    }

    try {
        const currentPuzzle = puzzleRegistry.findPuzzle(activeLayer.id);
        const evaluation = currentPuzzle.validate(submission);

        if (evaluation.success) {
            activeLayerIndex++;
            return res.json({
                status: "STATE UPGRADED",
                message: "Security override acknowledged.",
                nextLayer: systemLayers[activeLayerIndex]
            });
        }

        return res.status(400).json({ status: "DENIED", message: evaluation.message });
    } catch (error) {
        return res.status(500).json({ status: "ERROR", message: "Failed to evaluate puzzle layer." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Vault Engine running on port ${PORT}`);
});