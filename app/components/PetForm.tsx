'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { petSchema, type PetInput } from '@/lib/validations/pet';

interface PetFormProps {
    initialData?: PetInput & { id?: string };
    onSubmit: (data: PetInput) => Promise<void>;
    onCancel?: () => void;
    isLoading?: boolean;
}

export default function PetForm({ initialData, onSubmit, onCancel, isLoading }: PetFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PetInput>({
        resolver: zodResolver(petSchema),
        defaultValues: initialData || {
            name: '',
            type: 'DOG',
            age: 0,
            description: '',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Idade (anos)
                </label>
                <input
                    id="age"
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="Ex: 3"
                    min="0"
                />
                {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição (opcional)
                </label>
                <textarea
                    id="description"
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Conte mais sobre seu pet..."
                />
                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Salvando...' : initialData?.id ? 'Atualizar' : 'Criar Pet'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}
