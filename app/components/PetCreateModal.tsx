'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { petSchema, type PetInput } from '@/lib/validations/pet';
import { useState } from 'react';

interface PetCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PetInput) => Promise<void>;
    isLoading: boolean;
}

export default function PetCreateModal({ isOpen, onClose, onSubmit, isLoading }: PetCreateModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<PetInput>({
        resolver: zodResolver(petSchema),
        defaultValues: {
            name: '',
            type: 'DOG',
            breed: '',
            birthDate: '',
            description: '',
            ownerName: '',
            ownerPhone: '',
        },
    });

    const selectedType = watch('type');

    const handleFormSubmit = async (data: PetInput) => {
        await onSubmit(data);
        reset();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    // Máscara de telefone
    const formatPhone = (value: string): string => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 2) return `(${cleaned}`;
        if (cleaned.length <= 3) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(3)}`;
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setValue('ownerPhone', formatted);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/80"
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-400 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-white/60 hover:text-white transition"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Cadastrar</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Nome do Pet */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Nome
                            </label>
                            <input
                                type="text"
                                {...register('name')}
                                className="w-full px-3 py-2 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:outline-none transition"
                                placeholder="Nome Sobrenome"
                            />
                            {errors.name && (
                                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Tipo de Animal */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Animal
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setValue('type', 'DOG')}
                                    className={`flex-1 px-4 py-2 rounded-full border-2 transition ${selectedType === 'DOG'
                                        ? 'bg-cyan-400 border-cyan-400 text-slate-900 font-semibold'
                                        : 'border-white/30 text-white/60 hover:border-white/50'
                                        }`}
                                >
                                    Cachorro
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValue('type', 'CAT')}
                                    className={`flex-1 px-4 py-2 rounded-full border-2 transition ${selectedType === 'CAT'
                                        ? 'bg-cyan-400 border-cyan-400 text-slate-900 font-semibold'
                                        : 'border-white/30 text-white/60 hover:border-white/50'
                                        }`}
                                >
                                    Gato
                                </button>
                            </div>
                            {errors.type && (
                                <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Nome do Dono */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Dono
                            </label>
                            <input
                                type="text"
                                {...register('ownerName')}
                                className="w-full px-3 py-2 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:outline-none transition"
                                placeholder="Nome Sobrenome"
                            />
                            {errors.ownerName && (
                                <p className="text-red-400 text-xs mt-1">{errors.ownerName.message}</p>
                            )}
                        </div>

                        {/* Raça */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Raça
                            </label>
                            <input
                                type="text"
                                {...register('breed')}
                                className="w-full px-3 py-2 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:outline-none transition"
                                placeholder="Raça"
                            />
                            {errors.breed && (
                                <p className="text-red-400 text-xs mt-1">{errors.breed.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Telefone */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Telefone
                            </label>
                            <input
                                type="text"
                                {...register('ownerPhone')}
                                onChange={handlePhoneChange}
                                maxLength={16}
                                className="w-full px-3 py-2 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:outline-none transition"
                                placeholder="(00) 0 0000-0000"
                            />
                            {errors.ownerPhone && (
                                <p className="text-red-400 text-xs mt-1">{errors.ownerPhone.message}</p>
                            )}
                        </div>

                        {/* Data de Nascimento */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Nascimento
                            </label>
                            <input
                                type="date"
                                {...register('birthDate')}
                                className="w-full px-3 py-2 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:outline-none transition [color-scheme:dark]"
                            />
                            {errors.birthDate && (
                                <p className="text-red-400 text-xs mt-1">{errors.birthDate.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-slate-900 font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Voltar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-bold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
