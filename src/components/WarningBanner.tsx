'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WarningBanner({ isOffline }: { isOffline: boolean }) {
    const [warning, setWarning] = useState<string | null>(null);

    useEffect(() => {
        if (isOffline) {
            setWarning('⚠️ Работа в оффлайн-режиме. Платежи будут синхронизированы позже.');
        } else {
            // Rule-based logic: Mocking potential network instability (random for hackathon demo)
            const randomRisk = Math.random() > 0.7;
            if (randomRisk) {
                setWarning('🛡️ AI Alert: В вашем регионе замедление сети. Возможны сбои платежей.');
            } else {
                setWarning(null);
            }
        }
    }, [isOffline]);

    return (
        <AnimatePresence>
            {warning && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`w-full overflow-hidden ${isOffline ? 'bg-orange-500/20 text-orange-200' : 'bg-primary/20 text-indigo-200'}`}
                >
                    <div className="container mx-auto px-6 py-3 flex items-center justify-center gap-3 text-sm font-medium backdrop-blur-sm">
                        {isOffline ? <AlertTriangle size={18} /> : <AlertCircle size={18} />}
                        {warning}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
