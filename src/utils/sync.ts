'use client';

import { useEffect, useState } from 'react';
import { db, type Payment } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export async function syncPayments() {
  if (typeof window === 'undefined' || !navigator.onLine) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Получаем все несинхронизированные платежи из локальной БД
    const unsynced = await db.payments.where('synced').equals(0).toArray();

    if (unsynced.length === 0) return;

    for (const payment of unsynced) {
      const { id, synced, ...paymentData } = payment;

      const { error } = await supabase
        .from('payments')
        .insert([{
          ...paymentData,
          user_id: user.id
        }]);

      if (!error) {
        // Обновляем локально: ставим статус "синхронизировано"
        await db.payments.update(id!, { synced: 1, status: 'completed' });
      } else {
        console.error('Ошибка синхронизации конкретной записи:', error);
      }
    }
  } catch (err) {
    console.error('Критическая ошибка синхронизации:', err);
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
