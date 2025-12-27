'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });

            if (error) {
                alert(error.message);
            } else if (data.session) {
                // Если в Supabase выключено "Confirm email", сессия появится сразу
                router.push('/');
            } else {
                // Если подтверждение всё еще нужно
                alert('Регистрация успешна! Если вы не отключили подтверждение в Supabase, проверьте почту.');
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) alert(error.message);
            else router.push('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-10 w-full max-w-md"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-white mb-2 italic">
                        Resilient<span className="text-indigo-500">Tracker</span>
                    </h1>
                    <h2 className="text-xl font-bold text-slate-200">
                        {isSignUp ? 'Создать аккаунт' : 'С возвращением!'}
                    </h2>
                </div>

                <form onSubmit={handleAuth} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-400">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="demo@hackathon.kg"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder:text-slate-600"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-400">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder:text-slate-600"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="primary-button py-4 rounded-xl font-bold disabled:opacity-50 mt-4 text-white"
                    >
                        {loading ? 'Секунду...' : (isSignUp ? 'Зарегистрироваться' : 'Войти')}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4 text-center">
                    <p className="text-sm text-slate-500">
                        {isSignUp ? 'Уже есть аккаунт?' : 'Впервые здесь?'}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-indigo-400 hover:text-indigo-300 font-bold ml-2 underline underline-offset-4"
                        >
                            {isSignUp ? 'Войти' : 'Создать аккаунт'}
                        </button>
                    </p>

                    <div className="p-3 bg-indigo-500/10 rounded-lg text-[10px] text-indigo-300 leading-relaxed">
                        СОВЕТ ДЛЯ ЖЮРИ: Мы используем Local-first подход. Вы можете войти и сразу начать работу в оффлайне.
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
