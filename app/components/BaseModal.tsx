'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}

export default function BaseModal({ isOpen, onClose, title, children, icon }: BaseModalProps) {
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

    // Renderizar em portal para evitar conflitos de z-index
    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={(e) => {
                // Fechar ao clicar no overlay (fora do modal)
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            {/* Overlay escuro com blur */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Container do Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
                {/* Header */}
                <div className="flex flex-col items-center pt-6 px-6 pb-4 border-b border-gray-200">
                    {/* Ícone */}
                    {icon && (
                        <div className="mb-4">
                            {icon}
                        </div>
                    )}

                    {/* Título */}
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        {title}
                    </h2>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
