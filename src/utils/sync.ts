import { useEffect, useState } from 'react';
import { db, type Payment } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export async function syncPayments() {
    if (typeof window === 'undefined' || !navigator.onLine) return;

    try {
        // 1. Get all unsynced payments
        const unsynced = await db.payments.where('synced').equals(0).toArray();

        if (unsynced.length === 0) return;

        for (const payment of unsynced) {
            const { id, synced, ...paymentData } = payment; // Remove local ID/sync flag for Supabase

            const { error } = await supabase
                .from('payments')
                .insert([{
                    ...paymentData,
                    user_id: (await supabase.auth.getUser()).data.user?.id
                }]);

            if (!error) {
                // Update local status
                await db.payments.update(id!, { synced: 1, status: 'completed' });
            } else {
                console.error('Sync error:', error);
            }
        }
    } catch (err) {
        console.error('Failed to sync:', err);
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
