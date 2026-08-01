import React, { useState } from 'react';

export default function BookView({ onBreach }) {
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
        <div className="min-h-screen bg-slate-950 text-violet-400 font-mono p-8 selection:bg-violet-900 selection:text-white">
            <div className="max-w-2xl mx-auto border border-violet-600 p-6 bg-black rounded shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest border-b border-violet-600 pb-2">
                    [ERA_ARCHIVE] LITERARY DATABASE CROSS-REFERENCE
                </h1>
                <p className="mb-4 text-sm text-slate-300">
                    Analyze the 4 physical literary excerpts provided to your unit. Locate the source material within the department and extract the corresponding page numbers. Format them sequentially to reveal the target IPv4 network address.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setError(''); }}
                        className="w-full bg-slate-900 border border-violet-600 p-2 text-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-400 font-mono"
                        placeholder="E.G. 192.168.1.1"
                        autoFocus
                    />
                    {error && <div className="text-red-500 text-sm animate-pulse">!! {error}</div>}
                    <button type="submit" className="w-full bg-violet-700 text-white font-bold py-2 rounded hover:bg-violet-600 transition-all">
                        VERIFY NETWORK ADDRESS
                    </button>
                </form>
            </div>
        </div>
    );
}