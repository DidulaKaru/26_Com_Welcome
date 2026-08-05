import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'architect_banner_seen';
const BANNER_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export default function ArchitectBanner() {
    const [visible, setVisible] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [timeLeft, setTimeLeft] = useState(BANNER_DURATION_MS);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            const expiresAt = parseInt(stored, 10);
            const remaining = expiresAt - Date.now();

            if (remaining <= 0) {
                // Already expired — don't show
                return;
            }
            // Resume with remaining time
            setTimeLeft(remaining);
            setVisible(true);
        } else {
            // First visit — set expiry timestamp and show
            localStorage.setItem(STORAGE_KEY, String(Date.now() + BANNER_DURATION_MS));
            setTimeLeft(BANNER_DURATION_MS);
            setVisible(true);
        }
    }, []);

    // Countdown timer
    useEffect(() => {
        if (!visible) return;

        const tick = setInterval(() => {
            setTimeLeft(prev => {
                const next = prev - 1000;
                if (next <= 0) {
                    clearInterval(tick);
                    dismiss();
                    return 0;
                }
                return next;
            });
        }, 1000);

        return () => clearInterval(tick);
    }, [visible]);

    const dismiss = () => {
        setFadeOut(true);
        setTimeout(() => setVisible(false), 500);
    };

    if (!visible) return null;

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-center pt-6 px-4 pointer-events-none transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="pointer-events-auto max-w-2xl w-full bg-slate-900/90 backdrop-blur-xl border border-yellow-400/60 shadow-[0_0_40px_rgba(250,204,21,0.15)] p-6 relative animate-[slideDown_0.6s_ease-out]">

                {/* Corner Accents — Gold */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-yellow-400/80"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-yellow-400/80"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-yellow-400/80"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-yellow-400/80"></div>

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full border border-yellow-400 text-yellow-400 text-[10px] font-bold shadow-[0_0_8px_rgba(250,204,21,0.5)]">
                            ⚡
                        </span>
                        <h3 className="text-yellow-400 text-xs font-bold tracking-[0.2em] uppercase">
                            [TRANSMISSION FROM THE ARCHITECT]
                        </h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-yellow-400/60 text-[10px] font-mono tracking-wider">
                            {timeStr}
                        </span>
                        <button
                            onClick={dismiss}
                            className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                            aria-label="Dismiss"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Message */}
                <p className="text-blue-100 text-sm leading-relaxed font-mono">
                    "Welcome, Player. You stand at the threshold of something far greater than a game. What lies ahead will test your intellect, your resolve, and your ability to work as one.
                    <br /><br />
                    The System does not forgive weakness. But those who endure — those who rise — will find that their growth has no ceiling.
                    <br /><br />
                    Solve the trials. Break the layers. Prove that you belong."
                </p>
                <span className="text-yellow-400/70 mt-3 block font-bold tracking-widest uppercase text-[10px]">
                    — The Architect
                </span>
            </div>
        </div>
    );
}
