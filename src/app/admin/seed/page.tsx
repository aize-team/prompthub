'use client';

import { useState } from 'react';
import { fetchAndSeedPrompts } from '@/lib/prompt-data';

export default function SeedPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSeedDatabase = async () => {
        try {
            setStatus('loading');
            setMessage('Processing...');

            // Option 1: Client-side fetch and seed
            await fetchAndSeedPrompts();

            // Option 2: Server-side fetch and seed in one operation
            // const response = await fetch('/api/prompts/seed-all', {
            //   method: 'POST',
            // });

            // if (!response.ok) {
            //   throw new Error(`HTTP error! status: ${response.status}`);
            // }

            // const data = await response.json();
            // setMessage(data.message || 'Operation completed successfully');

            setStatus('success');
            setMessage('Database seeded successfully');
        } catch (error) {
            console.error('Seed operation failed:', error);
            setStatus('error');
            setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Database Seed Tool</h1>

            <div className="mb-6">
                <p className="mb-2">
                    This tool will fetch all prompts from the database and seed them back to the database.
                    Use this for data migration or recovery purposes.
                </p>
                <button
                    onClick={handleSeedDatabase}
                    disabled={status === 'loading'}
                    className={`px-4 py-2 rounded ${status === 'loading'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : status === 'success'
                                ? 'bg-green-500 hover:bg-green-600'
                                : status === 'error'
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                >
                    {status === 'loading' ? 'Processing...' : 'Fetch & Seed Database'}
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded ${status === 'success'
                        ? 'bg-green-100 border border-green-400 text-green-700'
                        : status === 'error'
                            ? 'bg-red-100 border border-red-400 text-red-700'
                            : 'bg-blue-100 border border-blue-400 text-blue-700'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
} 