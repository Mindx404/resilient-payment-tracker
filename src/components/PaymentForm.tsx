'use client';

import React, { useState } from 'react';
import { db } from '@/lib/db';
import { syncPayments } from '@/utils/sync';
import { Plus } from 'lucide-react';

export function PaymentForm({ onAdd }: { onAdd: () => void }) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;

        setLoading(true);
        try {
            await db.payments.add({
                amount: parseFloat(amount),
                description: description || 'Без описания',
                status: 'pending',
                createdAt: new Date().toISOString(),
                synced: 0
            });

            setAmount('');
            setDescription('');
            onAdd();

            // Attempt immediate sync if online
            if (navigator.onLine) {
                await syncPayments();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-6 w-full max-w-md">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Новый платеж
            </h2>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400">Сумма (сом)</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder:text-slate-600"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400">Описание</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Напр. Обед, Интернет..."
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder:text-slate-600"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="primary-button py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
                <Plus size={20} />
                {loading ? 'Сохранение...' : 'Добавить'}
            </button>
        </form>
    );
}
