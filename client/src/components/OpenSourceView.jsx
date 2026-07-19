import React, { useEffect, useState } from 'react';

export default function OpenSourceView({ onBreach }) {
    const [dots, setDots] = useState('');

    // 1. Simple visual loading animation
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const checkConfig = setInterval(() => {
            fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/config-status`)
                .then(res => res.json())
                .then(data => {
                    // 1. Conditional gate restored (checks for 200)
                    if (data.attackMode === true && data.rateLimit >= 200) {

                        // 2. Payload values fixed to match the era3-github.js validator
                        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/bypass-layer`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                submission: { attackModeEnabled: true, maxRateLimit: 200 }
                            })
                        }).then(() => onBreach());
                    }
                })
                .catch(err => console.error("Waiting for server..."));
        }, 3000);

        return () => clearInterval(checkConfig);
    }, [onBreach]);

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-mono flex items-center justify-center p-8 selection:bg-[#1f6feb] selection:text-white">
            <div className="max-w-3xl w-full border border-[#30363d] bg-[#161b22] rounded-md shadow-2xl overflow-hidden">

                {/* Terminal Header */}
                <div className="bg-[#010409] px-4 py-2 border-b border-[#30363d] flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="ml-2 text-xs text-[#8b949e]">bash — ERA_OPEN_SOURCE — 80x24</span>
                </div>

                {/* Terminal Body */}
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-[#30363d] pb-2 mb-4">
                        <span className="text-xl font-bold text-[#58a6ff]">PIPELINE STATUS: LOCKED</span>
                        <span className="text-xs px-2 py-1 bg-[#1f6feb]/20 text-[#58a6ff] rounded border border-[#1f6feb]/50 animate-pulse">
                            AWAITING CONFIGURATION PATCH
                        </span>
                    </div>

                    <div className="space-y-2 text-sm">
                        <p className="text-[#8b949e]">&gt; Initializing local environment...</p>
                        <p className="text-[#8b949e]">&gt; Scanning for rate-limiting configuration...</p>
                        <p className="text-[#ff7b72]">FATAL ERROR: Traffic throttle constraint active. Max requests = 1.</p>
                        <p className="text-[#8b949e]">&gt; Attempting local patch...</p>
                        <p className="text-[#ff7b72]">ACCESS DENIED: Core source is immutable from this terminal.</p>
                    </div>

                    <div className="p-4 bg-[#238636]/10 border border-[#238636]/30 rounded my-4">
                        <h3 className="text-[#3fb950] font-bold mb-2 flex items-center gap-2">
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.44a.25.25 0 0 1 .379-.213Z"></path>
                            </svg>
                            SYSTEM HINT NOTIFICATION
                        </h3>
                        <p className="text-[#c9d1d9] text-sm">
                            The configuration source code (`config.js`) is hosted remotely. Refer to the physical optical media (DVD) recovered in the previous phase to locate the upstream repository. You must fork the architecture, locate the configuration file, adjust the `MAX_RATE_LIMIT` and `ATTACK_MODE_ENABLED` variables, and submit a Pull Request.
                        </p>
                    </div>

                    <div className="pt-4 text-[#58a6ff] text-sm flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-[#58a6ff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Polling live server for configuration changes{dots}
                    </div>
                </div>
            </div>
        </div>
    );
}