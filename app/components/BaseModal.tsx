'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    icon: React.ReactNode;
    borderColor?: 'cyan' | 'red';
    maxWidth?: string;
}

export default function BaseModal({
    isOpen,
    onClose,
    title,
    children,
    icon,
    borderColor = 'cyan',
    maxWidth = 'max-w-3xl'
}: BaseModalProps) {
    // Travar scroll quando modal aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Fechar com ESC
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Classes dinâmicas baseadas em borderColor
    const borderClasses = borderColor === 'red'
        ? 'border-[#ED254E] shadow-[0_0_20px_4px_rgba(237,37,78,0.35)]'
        : 'border-[#00CAFC] shadow-[0_0_20px_4px_rgba(0,202,252,0.35)]';

    // Renderizar em portal para evitar conflitos de z-index
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay escuro com blur */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Container do Modal */}
            <div className={`relative bg-[#001E4D] border-4 ${borderClasses} rounded-3xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto p-8 animate-scaleIn`}>
                {/* Botão de Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white hover:text-[#00CAFC] transition z-10"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    {/* Ícone */}
                    {icon}

                    {/* Título */}
                    <h2 className="text-3xl font-bold text-white">
                        {title}
                    </h2>
                </div>

                {/* Conteúdo */}
                {children}
            </div>
        </div>,
        document.body
    );
}
