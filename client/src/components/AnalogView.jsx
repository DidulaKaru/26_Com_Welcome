import React, { useState } from 'react';

export default function AnalogView({ onBreach }) {
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
        <div className="min-h-screen bg-neutral-950 text-emerald-400 font-mono p-8">
            <div className="max-w-3xl mx-auto border border-emerald-500 p-6 bg-black shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                <h1 className="text-2xl font-bold mb-2 tracking-wide flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                    [ERA_ANALOG] CATHODE-RAY FREQUENCY ANALYZER
                </h1>
                <div className="w-full h-32 bg-zinc-900 border border-emerald-800 my-4 relative overflow-hidden rounded">
                    <svg className="w-full h-full opacity-60" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <path d="M 0 50 Q 50 20, 100 50 T 200 50 T 300 50 T 400 50" fill="none" stroke="#10b981" strokeWidth="2" className="animate-[dash_2s_linear_infinite]" />
                    </svg>
                    <div className="absolute top-2 left-2 text-xs text-emerald-600">LIVE COHERENT SPECTROGRAM FEED</div>
                </div>
                <p className="mb-4 text-sm text-emerald-500">
                    INSTRUCTION: Analyze the distorted magnetic audio track inside an external frequency-domain spectrogram tool. Input the hidden constant string located within the acoustic spikes.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setError(''); }}
                        className="w-full bg-stone-900 border border-emerald-600 p-2 text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono lowercase"
                        placeholder="input spectrum verification key..."
                    />
                    {error && <div className="text-rose-400 text-sm">[-] SYSTEM ALERT: {error}</div>}
                    <button type="submit" className="w-full bg-emerald-600 text-black font-bold py-2 rounded hover:bg-emerald-500 transition-all">
                        SUBMIT SIGNALS OVERRIDE
                    </button>
                </form>
            </div>
        </div>
    );
}