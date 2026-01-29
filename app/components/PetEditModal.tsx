'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { petSchema, type PetInput } from '@/lib/validations/pet';
import BaseModal from './BaseModal';

interface Pet {
    id: string;
    name: string;
    type: 'DOG' | 'CAT';
    breed: string;
    birthDate: string;
    description: string | null;
    ownerName: string;
    ownerPhone: string;
}

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

    if (!pet) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Editar Pet"
            icon={
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg
                        className="w-8 h-8 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                </div>
            }
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                {/* Nome */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Pet
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...register('name')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        placeholder="Ex: Rex, Mimi..."
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Tipo */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo
                        </label>
                        <select
                            id="type"
                            {...register('type')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        >
                            <option value="DOG">🐕 Cachorro</option>
                            <option value="CAT">🐈 Gato</option>
                        </select>
                        {errors.type && (
                            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                        )}
                    </div>

                    {/* Raça */}
                    <div>
                        <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
                            Raça
                        </label>
                        <input
                            id="breed"
                            type="text"
                            {...register('breed')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="Ex: Labrador"
                        />
                        {errors.breed && (
                            <p className="text-red-500 text-sm mt-1">{errors.breed.message}</p>
                        )}
                    </div>
                </div>

                {/* Data de Nascimento */}
                <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Nascimento
                    </label>
                    <input
                        id="birthDate"
                        type="date"
                        {...register('birthDate')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    />
                    {errors.birthDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
                    )}
                </div>

                {/* Nome do Dono */}
                <div>
                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Dono
                    </label>
                    <input
                        id="ownerName"
                        type="text"
                        {...register('ownerName')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        placeholder="Nome completo"
                    />
                    {errors.ownerName && (
                        <p className="text-red-500 text-sm mt-1">{errors.ownerName.message}</p>
                    )}
                </div>

                {/* Telefone */}
                <div>
                    <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone do Dono
                    </label>
                    <input
                        id="ownerPhone"
                        type="text"
                        {...register('ownerPhone')}
                        onChange={handlePhoneChange}
                        maxLength={16}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        placeholder="(00) 0 0000-0000"
                    />
                    {errors.ownerPhone && (
                        <p className="text-red-500 text-sm mt-1">{errors.ownerPhone.message}</p>
                    )}
                </div>

                {/* Descrição */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição (opcional)
                    </label>
                    <textarea
                        id="description"
                        {...register('description')}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                        placeholder="Conte mais sobre o pet..."
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
}
