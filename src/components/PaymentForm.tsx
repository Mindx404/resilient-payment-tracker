'use client';

import React, { useState } from 'react';
import { db } from '@/lib/db';
import { syncPayments } from '@/utils/sync';
import { Plus, QrCode, Loader2, CheckCircle2 } from 'lucide-react';
import { QRScanner } from './QRScanner';
import { motion, AnimatePresence } from 'framer-motion';

export function PaymentForm({ onAdd }: { onAdd: () => void }) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
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

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

            if (navigator.onLine) {
                await syncPayments();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleScan = (data: string) => {
        setAmount('120');
        setDescription('Оплата по QR');
        setShowScanner(false);
        setTimeout(() => handleSubmit(), 500);
    };

    return (
        <div className="relative">
            <AnimatePresence>
                {showScanner && (
                    <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-6 w-full relative overflow-hidden">
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 z-20 bg-emerald-500 flex flex-col items-center justify-center text-white"
                        >
                            <CheckCircle2 size={64} className="mb-4" />
                            <h3 className="text-2xl font-black uppercase">Оплата принята!</h3>
                            <p className="text-sm opacity-80 mt-2">Платёж зафикисирован в телефоне</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Новая оплата</h2>
                    <button
                        type="button"
                        onClick={() => setShowScanner(true)}
                        className="p-3 rounded-2xl bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] active:scale-95 transition-all"
                    >
                        <QrCode size={24} />
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Сумма (сом)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-white/5 border border-white/10 rounded-2xl px-5 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white text-3xl font-black placeholder:text-slate-800"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Что оплачиваем?</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Обед, проезд, магазин..."
                        className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white font-bold"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="primary-button py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 disabled:opacity-50 text-white"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'ПЛАТИТЬ'}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Безопасный оффлайн-режим активен
                </div>
            </form>
        </div>
    );
}
