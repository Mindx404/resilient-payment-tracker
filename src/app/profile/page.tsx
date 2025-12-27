'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { User, Shield, Zap, Mail, Calendar, Edit3, Camera, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Данные профиля
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        async function getProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);

                // Загружаем данные из таблицы profiles
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, avatar_url')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setUsername(data.username || user.email?.split('@')[0]);
                    setAvatarUrl(data.avatar_url);
                } else if (error && error.code === 'PGRST116') {
                    // Если профиля еще нет, создаем его
                    await supabase.from('profiles').insert([{ id: user.id, username: user.email?.split('@')[0] }]);
                    setUsername(user.email?.split('@')[0]);
                }
            }
            setLoading(false);
        }
        getProfile();
    }, []);

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) throw new Error('Выберите файл');

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = fileName;

            // Загрузка в Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Получаем публичный URL
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

            // Обновляем в БД профиля
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl, updated_at: new Date() })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setAvatarUrl(publicUrl);
            alert('Аватарка обновлена!');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const updateProfile = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('profiles')
                .update({ username, updated_at: new Date() })
                .eq('id', user.id);

            if (error) throw error;
            setIsEditing(false);
            alert('Профиль обновлен!');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !user) return <div className="min-h-screen flex items-center justify-center text-indigo-400 font-bold">ЗАГРУЗКА ПРОФИЛЯ...</div>;

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
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10" />

                        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-black text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] overflow-hidden">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.email?.[0].toUpperCase()
                                    )}
                                </div>

                                <label className="absolute bottom-[-10px] right-[-10px] p-3 bg-white text-[#0a0a0b] rounded-2xl cursor-pointer hover:scale-110 transition-transform shadow-xl">
                                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={uploadAvatar}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            <div className="text-center md:text-left flex-1">
                                {isEditing ? (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="text-3xl font-black text-white tracking-tighter bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={updateProfile} className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1 hover:text-emerald-300">
                                                <Check size={14} /> Сохранить
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                            <h1 className="text-4xl font-black text-white tracking-tighter">
                                                {username}
                                            </h1>
                                            <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-indigo-400 transition-colors">
                                                <Edit3 size={18} />
                                            </button>
                                        </div>
                                    </>
                                )}

                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
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
                                    <div className="flex items-center gap-3 text-white font-medium bg-white/5 p-4 rounded-xl border border-white/5 opacity-60">
                                        <Mail size={18} className="text-indigo-500" />
                                        {user?.email}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Member Since</span>
                                    <div className="flex items-center gap-3 text-white font-medium bg-white/5 p-4 rounded-xl border border-white/5">
                                        <Calendar size={18} className="text-indigo-500" />
                                        {user && new Date(user.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                                        <div className="w-[75%] h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-slate-400 text-sm">Очки XP</span>
                                        <span className="text-indigo-400 font-bold">850 / 1000</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                            <Shield className="text-emerald-500 shrink-0" size={32} />
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                Твой профиль полностью защищен. Мы не передаем твои данные третьим лицам и шифруем все транзакции. Продолжай обучение в Академии, чтобы повысить уровень!
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
