'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, BookOpen, User, Phone, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const navLinks = [
        { name: 'Главная', href: '/', icon: <Home size={20} /> },
        { name: 'Академия', href: '/academy', icon: <BookOpen size={20} /> },
        { name: 'Профиль', href: '/profile', icon: <User size={20} /> },
        { name: 'Контакты', href: '/contacts', icon: <Phone size={20} /> },
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-black text-white italic">
                        Resilient<span className="text-indigo-500">Tracker</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-bold uppercase tracking-widest transition-colors ${pathname === link.href ? 'text-indigo-500' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button
                        onClick={handleSignOut}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} />
                    </button>
                </div>

                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-16 left-0 w-full bg-[#0d0d0f] border-b border-white/10 md:hidden overflow-hidden z-50"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-4 text-lg font-bold ${pathname === link.href ? 'text-indigo-500' : 'text-slate-200'
                                        }`}
                                >
                                    <span className="text-indigo-500">{link.icon}</span>
                                    {link.name}
                                </Link>
                            ))}
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-4 text-lg font-bold text-red-500 pt-4 border-t border-white/5"
                            >
                                <LogOut size={20} />
                                Выйти
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
