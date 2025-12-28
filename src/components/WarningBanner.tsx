'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, ShieldAlert, CheckCircle2, CloudOff, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ConnectionIndicator({ isOnline }: { isOnline: boolean }) {
    const [risk, setRisk] = useState<'good' | 'medium' | 'high'>(isOnline ? 'good' : 'high');

    useEffect(() => {
        if (!isOnline) {
            setRisk('high');
            return;
        }
        const random = Math.random();
        if (random > 0.8) setRisk('medium');
        else setRisk('good');
    }, [isOnline]);

    const statusMap = {
        good: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: <Wifi size={16} />, text: 'Связь норм' },
        medium: { color: 'text-[#f59e0b]', bg: 'bg-amber-500/10', icon: <AlertCircle size={16} />, text: 'Риск сбоя' },
        high: { color: 'text-red-500', bg: 'bg-red-500/10', icon: <WifiOff size={16} />, text: 'Проблемы' },
    };

    const current = statusMap[risk];

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 ${current.bg} ${current.color}`}>
            {current.icon}
            <span className="text-[10px] font-black uppercase tracking-tighter">{current.text}</span>
        </div>
    );
}

export function WarningBanner({ isOffline }: { isOffline: boolean }) {
    const [warning, setWarning] = useState<string | null>(null);

    useEffect(() => {
        if (isOffline) {
            setWarning('📉 Интернета нет. Платёж сохранится в телефоне и пройдёт позже сам.');
        } else {
            const riskChance = Math.random() > 0.7;
            if (riskChance) {
                setWarning('⚠️ Возможны сбои. Рекомендуем иметь немного нала или ограничить траты.');
            } else {
                setWarning(null);
            }
        }
    }, [isOffline]);

    return (
        <AnimatePresence>
            {warning && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className={`w-full ${isOffline ? 'bg-orange-500/20' : 'bg-red-500/10'} border-b border-white/5`}
                >
                    <div className="container mx-auto px-6 py-4 flex items-center justify-center gap-3">
                        <ShieldAlert className={isOffline ? 'text-orange-400' : 'text-red-400'} size={20} />
                        <span className={`text-sm md:text-base font-bold ${isOffline ? 'text-orange-200' : 'text-red-200'}`}>
                            {warning}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
