'use client';

import { useEffect, useState } from 'react';
import { db, type Payment } from '@/lib/db';
import { supabase } from '@/lib/supabase';

/**
 * Синхронизация локальных данных С ОБЛАКОМ (Upload)
 */
export async function syncPayments() {
    if (typeof window === 'undefined' || !navigator.onLine) return;

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Получаем все несинхронизированные платежи (synced === 0)
        const unsynced = await db.payments.where('synced').equals(0).toArray();

        for (const payment of unsynced) {
            const { id, synced, ...paymentData } = payment;
            const { error } = await supabase
                .from('payments')
                .insert([{ ...paymentData, user_id: user.id }]);

            if (!error) {
                await db.payments.update(id!, { synced: 1, status: 'completed' });
            }
        }
    } catch (err) {
        console.error('Upload sync error:', err);
    }
}

/**
 * Загрузка данных ИЗ ОБЛАКА в локальную БД (Download)
 * Это решит проблему "зашел с телефона - пусто"
 */
export async function fetchFromCloud() {
    if (typeof window === 'undefined' || !navigator.onLine) return;

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: cloudPayments, error } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', user.id);

        if (error) throw error;

        if (cloudPayments) {
            for (const cp of cloudPayments) {
                // Проверяем, есть ли уже такой платеж локально (по дате или сумме/описанию)
                // В идеале в Supabase должен быть UUID, который мы храним и в Dexie
                const existing = await db.payments
                    .where('createdAt').equals(cp.createdAt)
                    .and(p => p.amount === cp.amount)
                    .first();

                if (!existing) {
                    await db.payments.add({
                        amount: cp.amount,
                        description: cp.description,
                        status: 'completed',
                        createdAt: cp.createdAt,
                        synced: 1
                    });
                }
            }
        }
    } catch (err) {
        console.error('Download sync error:', err);
    }
}

export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        setIsOnline(navigator.onLine);
        const handleOnline = () => {
            setIsOnline(true);
            syncPayments();
            fetchFromCloud(); // При появлении сети тоже подтягиваем данные
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}
