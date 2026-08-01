import React, { useState } from 'react';

export default function MorseView({ onBreach }) {
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
        <div className="min-h-screen bg-zinc-950 text-yellow-500 font-mono p-8">
            <div className="max-w-2xl mx-auto border border-yellow-600 p-6 bg-black rounded shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest border-b border-yellow-600 pb-2">
                    [ERA_MORSE] HARDWARE SIGNAL INTERCEPTION
                </h1>
                <p className="mb-4 text-sm text-zinc-300">
                    Inspect the hardware breadboard station. The integrated circuit requires proper multimeter troubleshooting, transistor configuration, or LED bridging to isolate the pulse signal output from the microcontroller pin[cite: 2]. Decode the Morse sequence to find the target NCC location node[cite: 2].
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setError(''); }}
                        className="w-full bg-zinc-900 border border-yellow-600 p-2 text-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 font-mono"
                        placeholder="ABCD"
                        autoFocus
                    />
                    {error && <div className="text-red-500 text-sm animate-pulse">!! {error}</div>}
                    <button type="submit" className="w-full bg-yellow-600 text-black font-bold py-2 rounded hover:bg-yellow-500 transition-all">
                        SUBMIT NODE TARGET COORDINATES
                    </button>
                </form>
            </div>
        </div>
    );
}