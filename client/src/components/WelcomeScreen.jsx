import React from 'react';

export default function WelcomeScreen() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center text-white font-sans selection:bg-sky-800">
            <div className="max-w-2xl bg-slate-900 border border-sky-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(14,165,233,0.15)] space-y-6">
                <div className="w-20 h-20 bg-sky-500/10 border border-sky-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                    <svg className="w-10 h-10 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                    SYSTEM SUCCESSFULLY ACCESSED
                </h1>
                <div className="h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent w-full" />
                <p className="text-slate-300 text-lg font-medium leading-relaxed">
                    Welcome to the Department of Computer Engineering. The state machine matrix has been fully synchronized across all infrastructure nodes.
                </p>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-left font-mono text-xs text-sky-400 space-y-1">
                    <div>&gt; Global state lock removed... SUCCESS</div>
                    <div>&gt; Core initialization sequence completed... STATUS: OK</div>
                    <div>&gt; Junior Orientation Event parameters active.</div>
                </div>
            </div>
        </div>
    );
}