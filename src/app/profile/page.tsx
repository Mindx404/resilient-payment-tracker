'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { User, Shield, Zap, Mail, Calendar, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            <Navbar />
            <main className="container mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="glass-card p-8 md:p-12 relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10" />

                        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-black text-white shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                                {user.email?.[0].toUpperCase()}
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">
                                    {user.email?.split('@')[0]}
                                </h1>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
                                        Resilient Pro
                                    </span>
                                    <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                                        Trusted User
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Email Address</span>
                                    <div className="flex items-center gap-3 text-white font-medium bg-white/5 p-4 rounded-xl border border-white/5">
                                        <Mail size={18} className="text-indigo-500" />
                                        {user.email}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Member Since</span>
                                    <div className="flex items-center gap-3 text-white font-medium bg-white/5 p-4 rounded-xl border border-white/5">
                                        <Calendar size={18} className="text-indigo-500" />
                                        {new Date(user.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-600/5 rounded-3xl p-8 border border-indigo-500/10">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Zap size={20} className="text-amber-400" />
                                    Твои достижения
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-sm">Уровень защиты</span>
                                        <span className="text-white font-bold">Lvl 12</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="w-[75%] h-full bg-indigo-500" />
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-slate-400 text-sm">Очки XP</span>
                                        <span className="text-indigo-400 font-bold">850 / 1000</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-300 font-bold transition-all flex items-center justify-center gap-2">
                            <Edit3 size={18} />
                            Редактировать профиль
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
