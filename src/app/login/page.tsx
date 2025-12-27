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
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) alert(error.message);
            else alert('Проверьте почту для подтверждения регистрации!');
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
                <h1 className="text-3xl font-black text-white mb-2">
                    {isSignUp ? 'Регистрация' : 'Вход'}
                </h1>
                <p className="text-slate-400 mb-8">
                    {isSignUp
                        ? 'Создайте аккаунт для синхронизации данных'
                        : 'Синхронизируйте ваши данные с облаком'}
                </p>

                <form onSubmit={handleAuth} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-400">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-400">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="primary-button py-4 rounded-xl font-bold disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Обработка...' : (isSignUp ? 'Зарегистрироваться' : 'Войти')}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    {isSignUp ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-indigo-400 hover:underline ml-2"
                    >
                        {isSignUp ? 'Войти' : 'Создать'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
}
