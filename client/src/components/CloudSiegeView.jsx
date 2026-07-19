import React, { useEffect, useState } from 'react';

// Generates a simple random ID for the current browser session
const generateClientId = () => Math.random().toString(36).substring(2, 15);

export default function CloudSiegeView({ metrics }) {
    const [clientId] = useState(generateClientId());

    // Automatic heartbeat ping
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/siege-ping`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId })
            }).catch(() => console.error("Heartbeat failed"));
        }, 2000);

        return () => clearInterval(interval);
    }, [clientId]);

    const progressPercentage = metrics
        ? Math.min((metrics.activeConnections / metrics.targetThreshold) * 100, 100)
        : 0;

    return (
        <div className="min-h-screen bg-neutral-950 text-red-500 font-mono p-8 selection:bg-red-900 selection:text-white">
            <div className="max-w-4xl mx-auto border-2 border-red-700 bg-black p-6 rounded shadow-[0_0_40px_rgba(220,38,38,0.3)] space-y-8">
                <div className="flex items-center justify-between border-b border-red-800 pb-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase text-red-600 animate-pulse">
                            [CRITICAL ALERT] ERA_CLOUD_SIEGE ACTIVE
                        </h1>
                        <p className="text-xs text-stone-400 mt-1">DISTRIBUTED CONCURRENCY INFRASTRUCTURE MATRIX</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span className="text-xs px-2 py-1 bg-red-950 border border-red-700 text-red-400 rounded font-bold animate-ping mb-1">
                            CONNECTION LIVE
                        </span>
                        <span className="text-[10px] text-red-800">NODE ID: {clientId.toUpperCase()}</span>
                    </div>
                </div>

                <div className="border border-red-900 bg-stone-950 p-8 rounded text-center">
                    <div className="text-sm text-stone-400 uppercase tracking-widest mb-4">Live Concurrent Connections</div>
                    <div className="text-7xl font-black text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
                        {metrics ? metrics.activeConnections : 0} <span className="text-xl text-red-700">/ {metrics?.targetThreshold}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-stone-400">
                        <span>NETWORK LOAD SATURATION</span>
                        <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-stone-900 h-8 rounded border border-red-900 overflow-hidden p-0.5">
                        <div
                            style={{ width: `${progressPercentage}%` }}
                            className="bg-gradient-to-r from-red-800 via-red-500 to-orange-500 h-full transition-all duration-1000 ease-in-out"
                        />
                    </div>
                </div>

                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded text-center space-y-4">
                    <p className="text-sm text-zinc-400 uppercase tracking-wider font-bold">
                        ACTION PLAN: MAINTAIN CONNECTION
                    </p>
                    <p className="text-xs text-zinc-500">
                        Keep this terminal open. To breach the final security matrix, exactly 200 nodes must maintain an active synchronization link simultaneously. Do not close your browser.
                    </p>
                </div>
            </div>
        </div>
    );
}