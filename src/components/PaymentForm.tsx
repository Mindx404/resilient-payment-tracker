'use client';

import React, { useState } from 'react';
import { db } from '@/lib/db';
import { syncPayments } from '@/utils/sync';
import { Plus, QrCode, Loader2 } from 'lucide-react';

export function PaymentForm({ onAdd }: { onAdd: () => void }) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [showQR, setShowQR] = useState(false);

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

            if (navigator.onLine) {
                await syncPayments();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const simulateQR = () => {
        setShowQR(true);
        setTimeout(() => {
            setAmount('150');
            setDescription('Оплата по QR (Обед)');
            setShowQR(false);
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-6 w-full">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    Новая оплата
                </h2>
                <button
                    type="button"
                    onClick={simulateQR}
                    className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all border border-indigo-500/30"
                    title="Сканировать QR"
                >
                    <QrCode size={24} />
                </button>
            </div>

            {showQR && (
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 text-center animate-pulse">
                    <Loader2 className="animate-spin mx-auto mb-2 text-indigo-400" />
                    <span className="text-xs text-indigo-300 font-bold uppercase tracking-widest">Сканирую QR-код...</span>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Сумма (сом)</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white text-xl font-bold"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Описание</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="За что платим?"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                />
            </div>

            <button
                type="submit"
                disabled={loading || showQR}
                className="primary-button py-5 rounded-xl font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50 mt-2 text-white"
            >
                <Plus size={24} />
                {loading ? 'СОХРАНЯЮ...' : 'ЗАФИКСИРОВАТЬ'}
            </button>

            <p className="text-[10px] text-center text-slate-500 leading-relaxed italic">
                *Данные сохранятся мгновенно даже без интернета
            </p>
        </form>
    );
}
