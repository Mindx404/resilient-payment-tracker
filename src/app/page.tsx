'use client';

import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useOnlineStatus, syncPayments } from '@/utils/sync';
import { WarningBanner } from '@/components/WarningBanner';
import { PaymentForm } from '@/components/PaymentForm';
import { PaymentList } from '@/components/PaymentList';
import { AnalyticsChart } from '@/components/AnalyticsChart';
import { ResilientAcademy } from '@/components/ResilientAcademy';
import { Wallet, TrendingUp, History, Coins, LogOut, ShieldCheck, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const isOnline = useOnlineStatus();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  const payments = useLiveQuery(() => db.payments.toArray()) || [];

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = payments.filter(p => p.synced === 0).length;

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
      setAuthLoading(false);
    }
    checkUser();
  }, [router]);

  useEffect(() => {
    if (isOnline && user) {
      syncPayments();
    }
  }, [isOnline, user]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-indigo-400 font-bold animate-pulse">ИНИЦИАЛИЗАЦИЯ ЗАЩИТЫ...</div>;

  // Prepare analytics data
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
      <div className="bg-indigo-600/10 text-indigo-400 text-center py-2 text-[10px] font-black uppercase tracking-[0.2em]">
        HACKATHON FinBilim 2025 • TEEN EDITION
      </div>

      <WarningBanner isOffline={!isOnline} />

      <div className="container mx-auto px-6 py-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black tracking-tighter text-white">
                Resilient<span className="text-indigo-500">Tracker</span>
              </h1>
              <div className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-bold uppercase">v2.0 Beta</div>
            </div>
            <p className="text-slate-400 font-medium">Салам, <span className="text-white">{user?.email?.split('@')[0]}</span>! Твой финансовый щит активирован.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2.5 flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-orange-500 shadow-[0_0_12px_#f59e0b]'}`} />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                {isOnline ? 'Online' : 'Offline Mode'}
              </span>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
              className="text-slate-400 hover:text-red-400 transition-colors p-3 bg-white/5 rounded-2xl"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-card p-6 border-b-4 border-b-indigo-500">
            <div className="flex items-center gap-3 mb-4 text-slate-500">
              <Wallet size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Траты в мес.</span>
            </div>
            <div className="text-3xl font-black text-white">
              {totalAmount.toLocaleString()} <span className="text-sm text-slate-500 font-medium">KGS</span>
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
          {/* Left: Academy & Analytics */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <ResilientAcademy />

            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="text-indigo-500" />
                  Моя активность
                </h3>
              </div>
              <AnalyticsChart data={chartData} />
            </div>

            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <History className="text-indigo-500" />
                  Последние чеки
                </h3>
              </div>
              <PaymentList payments={payments} />
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 flex flex-col gap-6">
              <PaymentForm onAdd={() => { }} />

              <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-indigo-400" />
                  Совет дня
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  &ldquo;Если QR в магазине не сканируется, проверь соединение. Если сети нет — просто запиши сумму в ResilientTracker, и мы напомним тебе оплатить её позже наличными или синхронизируем данные.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
