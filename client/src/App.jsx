import React, { useState, useEffect } from 'react';
import MechanicalView from './components/MechanicalView';
import AnalogView from './components/AnalogView';
import OpenSourceView from './components/OpenSourceView';
import CloudSiegeView from './components/CloudSiegeView';
import WelcomeScreen from './components/WelcomeScreen';

export default function App() {
    const [themeState, setThemeState] = useState("LOADING");
    const [metrics, setMetrics] = useState(null);

    const fetchState = () => {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/system-state`)
            .then(res => res.json())
            .then(data => {
                setThemeState(data.currentLayer.theme);
                if (data.metrics) setMetrics(data.metrics);
            })
            .catch(() => setThemeState("DISCONNECTED"));
    };

    useEffect(() => {
        fetchState();
        // Continuous polling for real-time morphing updates across all devices
        const interval = setInterval(fetchState, 2000);
        return () => clearInterval(interval);
    }, []);

    switch (themeState) {
        case "ERA_MECHANICAL":
            return <MechanicalView onBreach={fetchState} />;
        case "ERA_ANALOG":
            return <AnalogView onBreach={fetchState} />;
        case "ERA_OPEN_SOURCE":
            return <OpenSourceView onBreach={fetchState} />;
        case "ERA_CLOUD_SIEGE":
            return <CloudSiegeView metrics={metrics} onBreach={fetchState} />;
        case "SYSTEM_ACCESSED":
            return <WelcomeScreen />;
        case "DISCONNECTED":
            return (
                <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-mono text-xl animate-pulse">
                    [-] EMERGENCY: CORE LINK LOST. RETRYING SYNC...
                </div>
            );
        default:
            return (
                <div className="min-h-screen bg-black flex items-center justify-center text-yellow-500 font-mono text-lg">
                    [+] Establishing Secure Sync Link to Department Mainframe...
                </div>
            );
    }
}