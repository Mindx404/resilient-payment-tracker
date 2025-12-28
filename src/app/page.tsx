'use client';

import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useOnlineStatus, syncPayments, fetchFromCloud } from '@/utils/sync';
import { Navbar } from '@/components/Navbar';
import { WarningBanner, ConnectionIndicator } from '@/components/WarningBanner';
import { PaymentForm } from '@/components/PaymentForm';
import { PaymentList } from '@/components/PaymentList';
import { AnalyticsChart } from '@/components/AnalyticsChart';
import { Wallet, History, CreditCard, ArrowRightLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const isOnline = useOnlineStatus();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  const payments = useLiveQuery(() => db.payments.toArray()) || [];
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        await fetchFromCloud();
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

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-indigo-400 font-bold animate-pulse">ResilientPay ЗАГРУЗКА...</div>;

  const chartData = {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    values: [120, 300, 150, 450, 200, 100, 50], // Для MVP оставим простые данные для наглядности
  };

  return (
    <main className="min-h-screen pb-20 bg-[#0a0a0b] text-white">
      <WarningBanner isOffline={!isOnline} />
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Top Section: Balance & Status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-1">ResilientPay</h1>
            <p className="text-slate-500 font-medium">Твой кошелёк, который не боится сбоев</p>
          </div>
          <ConnectionIndicator isOnline={isOnline} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & History */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Wallet Card */}
            <div className="glass-card p-8 bg-gradient-to-br from-indigo-600 to-purple-700 border-none flex flex-col justify-between min-h-[220px] shadow-[0_20px_50px_rgba(99,102,241,0.2)]">
              <div className="flex justify-between items-start">
                <CreditCard size={32} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Digital Wallet</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1 block">Доступный баланс</span>
                <div className="text-5xl font-black tabular-nums">12,500 <span className="text-xl font-medium opacity-60">сом</span></div>
              </div>
            </div>

            {/* Simple Stats Overlay */}
            <div className="glass-card p-8 flex flex-col justify-between border-white/5">
              <div className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Защита активна
              </div>
              <div className="mt-8">
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                  «Твои платежи защищены нашей технологией оффлайн-сверки. Даже если всё отключится, ResilientPay сохранит каждый сом.»
                </p>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="lg:col-span-5 space-y-8">
            <PaymentForm onAdd={() => { }} />

            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <History className="text-indigo-500" />
                Последние траты
              </h3>
              <PaymentList payments={payments} />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <ArrowRightLeft className="text-indigo-500" />
                Твоя активность
              </h3>
              <div className="h-[300px]">
                <AnalyticsChart data={chartData} />
              </div>
            </div>

            {/* Quick Education Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="glass-card p-8 bg-white text-black border-none"
            >
              <h4 className="text-lg font-black uppercase mb-4">ФинБиты (XP: +50)</h4>
              <p className="font-bold text-sm mb-6 leading-relaxed">
                Знаешь ли ты, что 27% сбоев платежей в КР происходят из-за плохого света или интернета в регионах?
              </p>
              <button className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs">
                Узнать больше
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
