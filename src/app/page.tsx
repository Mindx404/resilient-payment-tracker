'use client';

import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useOnlineStatus, syncPayments, fetchFromCloud } from '@/utils/sync';
import { Navbar } from '@/components/Navbar';
import { WarningBanner } from '@/components/WarningBanner';
import { PaymentForm } from '@/components/PaymentForm';
import { PaymentList } from '@/components/PaymentList';
import { AnalyticsChart } from '@/components/AnalyticsChart';
import { Wallet, TrendingUp, History, Coins, ShieldCheck, Zap, ArrowDownCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const isOnline = useOnlineStatus();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const router = useRouter();

  const payments = useLiveQuery(() => db.payments.toArray()) || [];

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = payments.filter(p => p.synced === 0).length;

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        // Как только юзер загрузился, тянем данные из облака
        setSyncingCloud(true);
        await fetchFromCloud();
        setSyncingCloud(false);
      }
      setAuthLoading(false);
    }
    init();
  }, [router]);

  useEffect(() => {
    if (isOnline && user) {
      syncPayments();
    }
  }, [isOnline, user]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-indigo-400 font-bold animate-pulse">ИНИЦИАЛИЗАЦИЯ ЗАЩИТЫ...</div>;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const chartData = {
    labels: last7Days.map(date => new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })),
    values: last7Days.map(date =>
      payments
        .filter(p => p.createdAt.startsWith(date))
        .reduce((sum, p) => sum + p.amount, 0)
    )
  };

  return (
    <main className="min-h-screen pb-20 bg-[#0a0a0b]">
      <div className="bg-indigo-600/10 text-indigo-400 text-center py-2 text-[10px] font-black uppercase tracking-[0.2em] relative">
        HACKATHON FinBilim 2025 • TEEN EDITION
        {syncingCloud && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <ArrowDownCircle size={12} className="animate-bounce" />
            <span className="text-[8px]">Синхронизация...</span>
          </div>
        )}
      </div>

      <Navbar />
      <WarningBanner isOffline={!isOnline} />

      <div className="container mx-auto px-6 py-8">
        <header className="mb-12">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">
            Твой <span className="text-indigo-500">Обзор</span>
          </h2>
          <p className="text-slate-500 font-medium">Общая статистика твоей финансовой устойчивости</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-card p-6 border-b-4 border-b-indigo-500">
            <div className="flex items-center gap-3 mb-4 text-slate-500">
              <Wallet size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Траты (KGS)</span>
            </div>
            <div className="text-3xl font-black text-white">
              {totalAmount.toLocaleString()}
            </div>
          </div>

          <div className="glass-card p-6 border-b-4 border-b-orange-500">
            <div className="flex items-center gap-3 mb-4 text-slate-500">
              <Coins size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Ожидают сеть</span>
            </div>
            <div className="text-3xl font-black text-white">
              {pendingCount}
            </div>
          </div>

          <div className="glass-card p-6 border-b-4 border-b-emerald-500">
            <div className="flex items-center gap-3 mb-4 text-slate-500">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Твой Rank</span>
            </div>
            <div className="text-3xl font-black text-emerald-400 uppercase">
              Pro
            </div>
          </div>

          <div className="glass-card p-6 border-b-4 border-b-purple-500">
            <div className="flex items-center gap-3 mb-4 text-slate-500">
              <Zap size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">XP Очки</span>
            </div>
            <div className="text-3xl font-black text-purple-400">
              850
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="text-indigo-500" />
                  Активность расходов
                </h3>
              </div>
              <AnalyticsChart data={chartData} />
            </div>

            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <History className="text-indigo-500" />
                  История платежей
                </h3>
              </div>
              <PaymentList payments={payments} />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-6">
              <PaymentForm onAdd={() => { }} />

              <div className="glass-card p-6 bg-gradient-to-br from-white/2 to-white/5 border-white/5">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                  <ArrowDownCircle size={16} className="text-indigo-400" />
                  Умная синхронизация
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  Мы автоматически объединяем данные с твоего телефона и компьютера, чтобы твои расходы всегда были актуальны.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
