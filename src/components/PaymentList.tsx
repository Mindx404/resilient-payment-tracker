'use client';

import React from 'react';
import { type Payment } from '@/lib/db';
import { CheckCircle2, CloudOff, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function PaymentList({ payments }: { payments: Payment[] }) {
    if (payments.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500 italic">
                Платежей пока нет. Добавьте первый платеж!
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((p) => (
                <div key={p.id} className="glass-card p-4 flex items-center justify-between hover:border-indigo-500/30 transition-colors">
                    <div className="flex flex-col">
                        <span className="font-semibold text-white">{p.description}</span>
                        <span className="text-xs text-slate-500">
                            {format(new Date(p.createdAt), 'd MMMM, HH:mm', { locale: ru })}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-white">{p.amount.toLocaleString()} сом</span>
                        <div className="flex items-center gap-2">
                            {p.synced === 1 ? (
                                <div className="text-emerald-400 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider">
                                    <CheckCircle2 size={14} />
                                    <span>Облако</span>
                                </div>
                            ) : (
                                <div className="text-orange-400 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider">
                                    <CloudOff size={14} />
                                    <span>Локально</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
