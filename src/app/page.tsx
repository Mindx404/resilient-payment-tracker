'use client';

import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useOnlineStatus, syncPayments } from '@/utils/sync';
import { WarningBanner } from '@/components/WarningBanner';
import { PaymentForm } from '@/components/PaymentForm';
import { PaymentList } from '@/components/PaymentList';
import { AnalyticsChart } from '@/components/AnalyticsChart';
import { Wallet, TrendingUp, History, Coins } from 'lucide-react';

export default function Dashboard() {
  const isOnline = useOnlineStatus();
  const payments = useLiveQuery(() => db.payments.toArray()) || [];

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = payments.filter(p => p.synced === 0).length;

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

  useEffect(() => {
    if (isOnline) {
      syncPayments();
    }
  }, [isOnline]);

  return (
    <main className="min-h-screen pb-20">
      <WarningBanner isOffline={!isOnline} />

      <div className="container mx-auto px-6 py-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">
              Resilient<span className="text-indigo-500">Tracker</span>
            </h1>
            <p className="text-slate-400">Ваши финансы под защитой даже без интернета</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-orange-500'}`} />
              <span className="text-sm font-medium text-slate-300">
                {isOnline ? 'Онлайн' : 'Оффлайн'}
              </span>
            </div>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium px-4">Вход</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-4 mb-4 text-slate-400">
              <Wallet size={20} />
              <span className="text-sm font-semibold uppercase tracking-wider">Всего потрачено</span>
            </div>
            <div className="text-3xl font-bold text-white tracking-tighter">
              {totalAmount.toLocaleString()} <span className="text-lg text-slate-500 font-normal">сом</span>
            </div>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-orange-500">
            <div className="flex items-center gap-4 mb-4 text-slate-400">
              <Coins size={20} />
              <span className="text-sm font-semibold uppercase tracking-wider">Ожидают синхронизации</span>
            </div>
            <div className="text-3xl font-bold text-white tracking-tighter">
              {pendingCount} <span className="text-lg text-slate-500 font-normal">платежей</span>
            </div>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-4 mb-4 text-slate-400">
              <TrendingUp size={20} />
              <span className="text-sm font-semibold uppercase tracking-wider">Уровень защиты</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400 tracking-tighter">
              High <span className="text-lg text-slate-500 font-normal ml-2">98.4%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Analytics + History */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="text-indigo-500" />
                  Аналитика расходов
                </h3>
              </div>
              <AnalyticsChart data={chartData} />
            </div>

            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <History className="text-indigo-500" />
                  История транзакций
                </h3>
              </div>
              <PaymentList payments={payments} />
            </div>
          </div>

          {/* Right Column: Add Form */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <PaymentForm onAdd={() => { }} />

              <div className="mt-8 p-6 rounded-2xl border border-white/5 bg-white/2 italic text-sm text-slate-500">
                &ldquo;Ваши данные шифруются локально и передаются только по защищенным каналам связи.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
