'use client';

import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';

interface QRScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scanner.render(
            (decodedText) => {
                onScan(decodedText);
                scanner.clear();
            },
            (error) => {
            }
        );

        return () => {
            scanner.clear().catch(err => console.error("Failed to clear scanner", err));
        };
    }, [onScan]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Camera className="text-indigo-500" />
                    Сканируй QR
                </h3>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white">
                    <X size={24} />
                </button>
            </div>

            <div id="qr-reader" className="w-full max-w-sm rounded-3xl overflow-hidden border-2 border-indigo-500/50" />

            <p className="mt-8 text-slate-400 text-center text-sm">
                Наведи камеру на QR-код магазина или терминала
            </p>
        </div>
    );
}
