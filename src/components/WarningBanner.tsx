'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, CloudOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOCAL_RISKS = [
    "⚠️ В Бишкеке замечены сбои в сетях 4G — используйте оффлайн-режим для трекинга.",
    "🛡️ Прогноз: Риск сбоя QR-платежей сегодня высокий. Рекомендуем иметь 200 сом наличными.",
    "ℹ️ Новые правила ремиттансов: используйте только официальные приложения банков для переводов из РФ.",
    "🚨 Наблюдаются технические работы на серверах Элкарт. Платежи могут проходить с задержкой."
];

export function WarningBanner({ isOffline }: { isOffline: boolean }) {
    const [warning, setWarning] = useState<string | null>(null);

    useEffect(() => {
        if (isOffline) {
            setWarning('📉 Ты сейчас в ОФФЛАЙНЕ. Все данные сохраняются локально и улетят в облако, как только появится сеть.');
        } else {
            // Имитация AI-анализа: выбираем случайный риск из базы данных КР
            const randomRisk = LOCAL_RISKS[Math.floor(Math.random() * LOCAL_RISKS.length)];
            setWarning(randomRisk);
        }
    }, [isOffline]);

    return (
        <AnimatePresence>
            {warning && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className={`w-full ${isOffline ? 'bg-orange-500/20 border-b border-orange-500/30' : 'bg-indigo-500/20 border-b border-indigo-500/30'}`}
                >
                    <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-sm md:text-base font-semibold">
                            {isOffline ? (
                                <CloudOff className="text-orange-400 shrink-0" size={20} />
                            ) : (
                                <AlertTriangle className="text-indigo-400 shrink-0" size={20} />
                            )}
                            <span className={isOffline ? 'text-orange-200' : 'text-indigo-200'}>
                                {warning}
                            </span>
                        </div>
                        <button onClick={() => setWarning(null)} className="text-white/20 hover:text-white/50 transition-colors">
                            ✕
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
