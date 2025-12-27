'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { ResilientAcademy } from '@/components/ResilientAcademy';
import { BookOpen, Shield, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AcademyPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            <Navbar />
            <main className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">
                            Resilient <span className="text-indigo-500">Academy</span>
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Проходи интерактивные уроки, зарабатывай очки и становись экспертом в цифровой безопасности.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-2">
                            <ResilientAcademy />
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="glass-card p-6 border-l-4 border-indigo-500">
                                <div className="flex items-center gap-3 text-white font-bold mb-2">
                                    <Zap size={18} className="text-amber-400" />
                                    Твой прогресс
                                </div>
                                <p className="text-xs text-slate-500">Ты прошел 2 урока из 10. Твой фокус сегодня: 'Распознавание фишинга'.</p>
                            </div>

                            <div className="glass-card p-6 border-l-4 border-emerald-500">
                                <div className="flex items-center gap-3 text-white font-bold mb-2">
                                    <Shield size={18} className="text-emerald-400" />
                                    Защита
                                </div>
                                <p className="text-xs text-slate-500">Твой уровень защиты: **Bronze**. Заверши этот модуль, чтобы получить **Silver**!</p>
                            </div>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-8">Другие модули</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Основы санкций', desc: 'Как санкции влияют на карты', icon: <Target className="text-red-400" /> },
                                { title: 'Безопасный перенос', desc: 'Как переводить деньги без потерь', icon: <BookOpen className="text-blue-400" /> },
                                { title: 'QR Охота', desc: 'Все о QR платежах в КР', icon: <Zap className="text-purple-400" /> },
                            ].map((item, i) => (
                                <div key={i} className="glass-card p-6 group cursor-pointer hover:border-indigo-500/30 transition-all">
                                    <div className="mb-4">{item.icon}</div>
                                    <h4 className="text-white font-bold mb-2 group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                                    <p className="text-xs text-slate-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
