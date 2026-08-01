import React from 'react';

export default function WelcomeScreen() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center text-white font-sans selection:bg-sky-800">
            <div className="max-w-2xl bg-slate-900 border border-emerald-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)] space-y-8">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                    <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <div>
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                        VAULT SIEGE SUCCESSFULLY COMPLETED
                    </h1>
                    <p className="text-slate-400 text-sm mt-4 font-mono">
            // ALL FIREWALLS BREACHED. SYSTEM MATRICES UNLOCKED.
                    </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent w-full" />

                <p className="text-slate-300 text-lg font-medium leading-relaxed">
                    Amazing work. You have breached all chronological eras and bypassed the server defense matrix. Your final directive has been compiled into a secure batch executable.
                </p>

                {/* Download Button */}
                <a
                    href="/Go Ahead Open This.bat"
                    download="Go Ahead Open This.bat"
                    className="inline-flex items-center gap-3 bg-emerald-600/20 border border-emerald-500 text-emerald-400 font-bold py-4 px-8 rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    DOWNLOAD FINAL CLUE [BATCH EXECUTABLE]
                </a>
            </div>
        </div>
    );
}