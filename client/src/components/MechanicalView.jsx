import React, { useState } from 'react';

export default function MechanicalView({ onBreach }) {
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
        <div className="min-h-screen bg-black text-amber-500 font-mono p-8 selection:bg-amber-800 selection:text-black">
            <div className="max-w-2xl mx-auto border border-amber-600 p-6 bg-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest border-b border-amber-600 pb-2">
                    [ERA_MECHANICAL] SECURE TELEPRINTER INTERFACE
                </h1>
                <p className="mb-6 leading-relaxed">
                    SYSTEM NOTICE: READ HOLE CONFIGURATIONS ON PHYSICAL HOLLERITH CARDS. TRANSLATE BINARY ROWS VIA ASCII DECODE MATRIX. SUBMIT TERMINAL DEPLOYMENT COORDINATES BELOW.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-bold">&gt; INPUT DECODE STRING:</label>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => { setInput(e.target.value); setError(''); }}
                            className="w-full bg-black border border-amber-600 p-2 text-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder-amber-800 font-mono uppercase"
                            placeholder="Enter the string you've got. This is not case sensitive"
                            autoFocus
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm animate-pulse">!! {error}</div>}
                    <button type="submit" className="w-full bg-amber-600 text-black font-bold py-2 px-4 border border-amber-500 hover:bg-amber-500 transition-colors">
                        EXECUTE CARD FEED CONVERSION
                    </button>
                </form>
            </div>
        </div>
    );
}