'use client';

import { useEffect, useState } from 'react';
import { db, type Payment } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export async function syncPayments() {
    if (typeof window === 'undefined' || !navigator.onLine) return;

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

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
            fetchFromCloud();
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
