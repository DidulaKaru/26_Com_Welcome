import React, { useState } from 'react';

export default function HashView({ onBreach }) {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/bypass-layer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ submission: input })
        })
            .then(async res => {
                const data = await res.json();
                if (res.ok) onBreach();
                else setError(data.message);
            });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-cyan-400 font-mono p-8">
            <div className="max-w-2xl mx-auto border border-cyan-600 p-6 bg-black rounded shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest border-b border-cyan-600 pb-2">
                    [ERA_HASH] 50-MILLION ITERATION CRYPTOGRAPHIC GATE
                </h1>

                <p className="mb-4 text-sm text-slate-300">
                    Compile and execute the provided C script. Feed the hex keys extracted from your punch cards as the seed sequence to execute 50,000,000 algorithmic iterations. Input the resulting output hash below.
                </p>

                {/* Download Button Section */}
                <div className="mb-8 p-4 bg-cyan-950/30 border border-cyan-900 rounded flex items-center justify-between">
                    <span className="text-cyan-500 text-sm">Target File: <code className="text-cyan-300 font-bold">puzzle.c</code></span>
                    <a
                        href="/puzzle.c"
                        download="puzzle.c"
                        className="inline-flex items-center gap-2 bg-cyan-800 text-white text-xs font-bold py-2 px-4 rounded hover:bg-cyan-700 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        DOWNLOAD SCRIPT
                    </a>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setError(''); }}
                        className="w-full bg-slate-900 border border-cyan-600 p-2 text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
                        placeholder="Enter computation hash output..."
                        autoFocus
                    />
                    {error && <div className="text-red-500 text-sm animate-pulse">!! {error}</div>}
                    <button type="submit" className="w-full bg-cyan-600 text-black font-bold py-2 rounded hover:bg-cyan-500 transition-all">
                        VERIFY HASH SIGNATURE
                    </button>
                </form>
            </div>
        </div>
    );
}