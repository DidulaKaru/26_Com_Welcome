const express = require('express');
const cors = require('cors');
const puzzleRegistry = require('./puzzles/puzzleRegistry');
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

const systemLayers = [
    { id: "punchcards", theme: "ERA_MECHANICAL" },
    { id: "audio", theme: "ERA_ANALOG" },
    { id: "github", theme: "ERA_OPEN_SOURCE" },
    { id: "siege", theme: "ERA_CLOUD_SIEGE" },
    { id: "unlocked", theme: "SYSTEM_ACCESSED" }
];

app.get('/api/v1/config-status', (req, res) => {
    // 1. Resolve the absolute path to the config file
    const configPath = require.resolve('./config.js');

    // 2. Delete the cached version from memory
    delete require.cache[configPath];

    // 3. Require the file fresh from the disk
    const liveConfig = require('./config.js');

    // 4. Serve the updated values
    res.json({
        attackMode: liveConfig.ATTACK_MODE_ENABLED,
        rateLimit: liveConfig.MAX_RATE_LIMIT
    });
});

let activeLayerIndex = 0;

let siegeMetrics = {
    activeConnections: 0,
    targetThreshold: 200 // Fully decoupled from config.js
};

// Map to track unique client IDs and their last ping timestamp
const activeUsers = new Map();

// Heartbeat evaluation loop
setInterval(() => {
    if (systemLayers[activeLayerIndex].id !== "siege") return;

    const now = Date.now();
    let currentActiveCount = 0;

    // Evaluate all connected users
    for (let [clientId, lastPing] of activeUsers.entries()) {
        if (now - lastPing > 5000) {
            // Drop users who haven't pinged in the last 5 seconds
            activeUsers.delete(clientId);
        } else {
            currentActiveCount++;
        }
    }

    siegeMetrics.activeConnections = currentActiveCount;

    // Trigger completion if 200 active concurrent connections are reached
    if (currentActiveCount >= siegeMetrics.targetThreshold) {
        activeLayerIndex++; // Globally upgrade to SYSTEM_ACCESSED
    }
}, 1000);

app.get('/api/v1/system-state', (req, res) => {
    res.json({
        currentLayer: systemLayers[activeLayerIndex],
        layerIndex: activeLayerIndex,
        metrics: systemLayers[activeLayerIndex].id === "siege" ? siegeMetrics : null
    });
});

// New Heartbeat Endpoint
app.post('/api/v1/siege-ping', (req, res) => {
    if (systemLayers[activeLayerIndex].id !== "siege") {
        return res.status(400).json({ status: "DENIED", message: "Siege endpoint is offline." });
    }

    const { clientId } = req.body;
    if (clientId) {
        // Register or update the user's latest check-in time
        activeUsers.set(clientId, Date.now());
    }

    res.json({ status: "ACKNOWLEDGED" });
});

app.post('/api/v1/bypass-layer', (req, res) => {
    const { submission } = req.body;
    const activeLayer = systemLayers[activeLayerIndex];

    if (activeLayer.id === "unlocked") {
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