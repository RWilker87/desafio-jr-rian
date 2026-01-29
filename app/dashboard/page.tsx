'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PetForm from '../components/PetForm';
import type { PetInput } from '@/lib/validations/pet';

interface Pet {
    id: string;
    name: string;
    type: 'DOG' | 'CAT';
    age: number;
    description: string | null;
    createdAt: string;
}

interface User {
    id: string;
    email: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUser();
        fetchPets();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
        }
    };

    const fetchPets = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/pets');
            if (response.ok) {
                const data = await response.json();
                setPets(data.pets);
            }
        } catch (error) {
            console.error('Erro ao buscar pets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    const handleCreatePet = async (data: PetInput) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/pets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                await fetchPets();
                setIsCreating(false);
            } else {
                const error = await response.json();
                alert(error.error || 'Erro ao criar pet');
            }
        } catch (error) {
            alert('Erro ao criar pet');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdatePet = async (data: PetInput) => {
        if (!editingPet) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/pets/${editingPet.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                await fetchPets();
                setEditingPet(null);
            } else {
                const error = await response.json();
                alert(error.error || 'Erro ao atualizar pet');
            }
        } catch (error) {
            alert('Erro ao atualizar pet');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePet = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este pet?')) return;

        try {
            const response = await fetch(`/api/pets/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchPets();
            } else {
                const error = await response.json();
                alert(error.error || 'Erro ao deletar pet');
            }
        } catch (error) {
            alert('Erro ao deletar pet');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">🐾 Pet Manager</h1>
                        {user && <p className="text-sm text-gray-600">Olá, {user.email}</p>}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium"
                    >
                        Sair
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Botão Criar */}
                {!isCreating && !editingPet && (
                    <div className="mb-6">
                        <button
                            onClick={() => setIsCreating(true)}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-md"
                        >
                            + Adicionar Pet
                        </button>
                    </div>
                )}

                {/* Formulário de Criação */}
                {isCreating && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Novo Pet</h2>
                        <PetForm
                            onSubmit={handleCreatePet}
                            onCancel={() => setIsCreating(false)}
                            isLoading={isSubmitting}
                        />
                    </div>
                )}

                {/* Formulário de Edição */}
                {editingPet && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Editar Pet</h2>
                        <PetForm
                            initialData={editingPet}
                            onSubmit={handleUpdatePet}
                            onCancel={() => setEditingPet(null)}
                            isLoading={isSubmitting}
                        />
                    </div>
                )}

                {/* Lista de Pets */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Meus Pets</h2>

                    {isLoading ? (
                        <p className="text-gray-600">Carregando...</p>
                    ) : pets.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <p className="text-gray-600 text-lg">Você ainda não tem pets cadastrados.</p>
                            <p className="text-gray-500 mt-2">Clique em "Adicionar Pet" para começar!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pets.map((pet) => (
                                <div
                                    key={pet.id}
                                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                                        <span className="text-2xl">{pet.type === 'DOG' ? '🐕' : '🐈'}</span>
                                    </div>

                                    <p className="text-gray-600 mb-2">
                                        <span className="font-semibold">Idade:</span> {pet.age} {pet.age === 1 ? 'ano' : 'anos'}
                                    </p>

                                    {pet.description && (
                                        <p className="text-gray-600 mb-4 text-sm italic">{pet.description}</p>
                                    )}

                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => setEditingPet(pet)}
                                            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-medium"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeletePet(pet.id)}
                                            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium"
                                        >
                                            Deletar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
