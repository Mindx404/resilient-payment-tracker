'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Award, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "К тебе пришло SMS: 'Ваш счет в Elcart заблокирован. Перейдите по ссылке для разблокировки'. Твои действия?",
        options: [
            "Сразу перейду и введу данные",
            "Проверю адрес ссылки и позвоню в банк по официальному номеру",
            "Удалю SMS и забуду"
        ],
        correct: 1,
        tip: "Банки никогда не присылают ссылки для ввода паролей в SMS!"
    },
    {
        id: 2,
        question: "В Бишкеке объявили о плановых отключениях света в твоем районе. Как лучше подготовиться к покупкам в магазине?",
        options: [
            "Надеться на QR-платеж",
            "Взять с собой наличные (сом)",
            "Попросить в долг у продавца"
        ],
        correct: 1,
        tip: "При отключении света терминалы и интернет могут не работать."
    }
];

export function ResilientAcademy() {
    const [currentStep, setCurrentStep] = useState(0);
    const [points, setPoints] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const handleAnswer = (index: number) => {
        setSelectedOption(index);
        if (index === QUIZ_QUESTIONS[currentStep].correct) {
            setPoints(prev => prev + 50);
        }

        setTimeout(() => {
            if (currentStep < QUIZ_QUESTIONS.length - 1) {
                setCurrentStep(prev => prev + 1);
                setSelectedOption(null);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    return (
        <div className="glass-card p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="text-amber-400" />
                    Resilient Academy
                </h3>
                <div className="bg-indigo-500/20 px-3 py-1 rounded-full text-indigo-400 text-sm font-bold">
                    {points} XP
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!showResult ? (
                    <motion.div
                        key={currentStep}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="flex flex-col gap-4"
                    >
                        <p className="text-slate-200 font-medium text-lg leading-relaxed">
                            {QUIZ_QUESTIONS[currentStep].question}
                        </p>
                        <div className="flex flex-col gap-2">
                            {QUIZ_QUESTIONS[currentStep].options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(i)}
                                    className={`p-4 rounded-xl text-left transition-all border ${selectedOption === i
                                            ? (i === QUIZ_QUESTIONS[currentStep].correct ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-red-500/20 border-red-500 text-red-200')
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-8"
                    >
                        <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-4" />
                        <h4 className="text-2xl font-bold text-white mb-2">Урок завершен!</h4>
                        <p className="text-slate-400 mb-6 font-medium">Ты заработал {points} XP. Твой уровень финансовой защиты вырос!</p>
                        <button
                            onClick={() => { setCurrentStep(0); setShowResult(false); setPoints(0); }}
                            className="primary-button px-8 py-3 rounded-xl font-bold"
                        >
                            Пройти еще раз
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
