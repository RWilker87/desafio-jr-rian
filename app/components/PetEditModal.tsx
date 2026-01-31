'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { petSchema, type PetInput } from '@/lib/validations/pet';
import type { Pet } from '@/types';
import BaseModal from './BaseModal';
import DatePickerPtBR from './DatePickerPtBR';

interface PetEditModalProps {
    isOpen: boolean;
    pet: Pet | null;
    onClose: () => void;
    onSubmit: (data: PetInput) => Promise<void>;
    isLoading: boolean;
}

export default function PetEditModal({ isOpen, pet, onClose, onSubmit, isLoading }: PetEditModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<PetInput>({
        resolver: zodResolver(petSchema),
        values: pet ? {
            name: pet.name,
            type: pet.type,
            breed: pet.breed,
            birthDate: pet.birthDate?.split('T')[0] || '',
            description: pet.description || '',
            ownerName: pet.ownerName,
            ownerPhone: pet.ownerPhone,
        } : undefined,
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

    if (!pet || !isOpen) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Editar"
            icon={
                <div className="w-20 h-20 bg-gradient-to-br from-[#00CAFC] to-[#0056E2] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
            }
        >
            {/* Form */}
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Nome do Pet */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2 font-medium">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Nome
                            </label>
                            <input
                                type="text"
                                {...register('name')}
                                className="w-full px-4 py-3 bg-transparent border-2 border-[#0056E2]/50 rounded-xl text-white placeholder-[#404A5C] focus:border-[#00CAFC] focus:outline-none transition"
                                placeholder="Nome Sobrenome"
                            />
                            {errors.name && (
                                <p className="text-[#ED254E] text-xs mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Nome do Dono */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2 font-medium">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Dono
                            </label>
                            <input
                                type="text"
                                {...register('ownerName')}
                                className="w-full px-4 py-3 bg-transparent border-2 border-[#0056E2]/50 rounded-xl text-white placeholder-[#404A5C] focus:border-[#00CAFC] focus:outline-none transition"
                                placeholder="Nome Sobrenome"
                            />
                            {errors.ownerName && (
                                <p className="text-[#ED254E] text-xs mt-1">{errors.ownerName.message}</p>
                            )}
                        </div>

                        {/* Telefone */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2 font-medium">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Telefone
                            </label>
                            <input
                                type="text"
                                {...register('ownerPhone')}
                                onChange={handlePhoneChange}
                                maxLength={16}
                                className="w-full px-4 py-3 bg-transparent border-2 border-[#0056E2]/50 rounded-xl text-white placeholder-[#404A5C] focus:border-[#00CAFC] focus:outline-none transition"
                                placeholder="(00) 0 0000-0000"
                            />
                            {errors.ownerPhone && (
                                <p className="text-[#ED254E] text-xs mt-1">{errors.ownerPhone.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Tipo de Animal */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2 font-medium">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Animal
                            </label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setValue('type', 'DOG')}
                                    className={`flex-1 px-6 py-3 rounded-full border-2 font-medium transition ${selectedType === 'DOG'
                                        ? 'bg-white border-white text-[#001E4D]'
                                        : 'border-[#0056E2]/50 text-white/60 hover:border-[#0056E2]'
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedType === 'DOG' ? 'border-[#001E4D]' : 'border-white/60'
                                            }`}>
                                            {selectedType === 'DOG' && (
                                                <div className="w-2 h-2 rounded-full bg-[#001E4D]" />
                                            )}
                                        </div>
                                        Cachorro
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValue('type', 'CAT')}
                                    className={`flex-1 px-6 py-3 rounded-full border-2 font-medium transition ${selectedType === 'CAT'
                                        ? 'bg-white border-white text-[#001E4D]'
                                        : 'border-[#0056E2]/50 text-white/60 hover:border-[#0056E2]'
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedType === 'CAT' ? 'border-[#001E4D]' : 'border-white/60'
                                            }`}>
                                            {selectedType === 'CAT' && (
                                                <div className="w-2 h-2 rounded-full bg-[#001E4D]" />
                                            )}
                                        </div>
                                        Gato
                                    </div>
                                </button>
                            </div>
                            {errors.type && (
                                <p className="text-[#ED254E] text-xs mt-1">{errors.type.message}</p>
                            )}
                        </div>

                        {/* Raça */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2 font-medium">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Raça
                            </label>
                            <input
                                type="text"
                                {...register('breed')}
                                className="w-full px-4 py-3 bg-transparent border-2 border-[#0056E2]/50 rounded-xl text-white placeholder-[#404A5C] focus:border-[#00CAFC] focus:outline-none transition"
                                placeholder="Raça"
                            />
                            {errors.breed && (
                                <p className="text-[#ED254E] text-xs mt-1">{errors.breed.message}</p>
                            )}
                        </div>

                        {/* Data de Nascimento */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2 font-medium">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Nascimento <span className="text-[#404A5C] font-normal">(Aproximado)</span>
                            </label>
                            <DatePickerPtBR
                                value={watch('birthDate')}
                                onChange={(date) => setValue('birthDate', date)}
                                placeholder="DD/MM/AAAA"
                            />
                            {errors.birthDate && (
                                <p className="text-[#ED254E] text-xs mt-1">{errors.birthDate.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-8">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-gray-100 text-[#0056E2] font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Voltar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-8 py-3 bg-gradient-to-r from-[#00CAFC] to-[#0056E2] hover:opacity-90 text-white font-bold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
}
