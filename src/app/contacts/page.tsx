'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Mail, Phone, MessageSquare, MapPin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            <Navbar />
            <main className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 text-center md:text-left">
                        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">
                            Связь с <span className="text-indigo-500">командой</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            Есть вопросы по работе приложения или идеи для улучшения безопасности? Мы всегда на связи для молодежи Кыргызстана.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-6">
                            <div className="glass-card p-6 flex items-start gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Email</h4>
                                    <p className="text-slate-400">support@resilient.kg</p>
                                </div>
                            </div>

                            <div className="glass-card p-6 flex items-start gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Telegram</h4>
                                    <p className="text-slate-400">@resilient_tracker_bot</p>
                                </div>
                            </div>

                            <div className="glass-card p-6 flex items-start gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Горячая линия</h4>
                                    <p className="text-slate-400">+996 (555) 123-456</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 flex flex-col justify-center items-center text-center bg-gradient-to-br from-indigo-600/5 to-purple-600/5">
                            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 mb-6 animate-pulse">
                                <Globe size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Наш офис в Бишкеке</h3>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                ул. Абдрахманова 105, IT-Hub<br />
                                Кыргызстан, 720000
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Сейчас открыто</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
