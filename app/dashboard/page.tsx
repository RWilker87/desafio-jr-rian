'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PetDeleteModal from '../components/PetDeleteModal';
import PetEditModal from '../components/PetEditModal';
import PetCreateModal from '../components/PetCreateModal';
import PetCardExpandable from '../components/PetCardExpandable';
import type { PetInput } from '@/lib/validations/pet';

interface Pet {
    id: string;
    name: string;
    type: 'DOG' | 'CAT';
    breed: string;
    birthDate: string;
    description: string | null;
    ownerName: string;
    ownerPhone: string;
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
    const [deletingPet, setDeletingPet] = useState<Pet | null>(null);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [isCreateLoading, setIsCreateLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [isEditLoading, setIsEditLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

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

    const handleCreateSubmit = async (data: PetInput) => {
        setIsCreateLoading(true);
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
            setIsCreateLoading(false);
        }
    };

    const handleEditSubmit = async (data: PetInput) => {
        if (!editingPet) return;

        setIsEditLoading(true);
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
            setIsEditLoading(false);
        }
    };

    const handleDeleteConfirm = async (petId: string) => {
        setIsDeleteLoading(true);
        try {
            const response = await fetch(`/api/pets/${petId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchPets();
                setDeletingPet(null);
            } else {
                const error = await response.json();
                alert(error.error || 'Erro ao deletar pet');
            }
        } catch (error) {
            alert('Erro ao deletar pet');
        } finally {
            setIsDeleteLoading(false);
        }
    };

    // Toggle selected pet (fecha o anterior se outro for clicado)
    const handleSelectPet = (petId: string) => {
        setSelectedPetId(prev => prev === petId ? null : petId);
    };

    // Filter pets based on search query
    const filteredPets = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0E0014] to-[#001E4D]">
            {/* Header */}
            <header className="px-8 py-6">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <h1 className="text-3xl font-bold text-white">SoftPet</h1>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-12 flex items-center gap-4">
                        <div className="flex-1 relative">
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#404A5C]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder=""
                                className="w-full pl-12 pr-4 py-3 bg-[#001E4D] border border-[#0056E2]/30 rounded-lg text-white placeholder-[#404A5C] focus:border-[#0056E2] focus:outline-none transition"
                            />
                        </div>
                        <button className="px-8 py-3 bg-[#404A5C] hover:bg-[#404A5C]/80 text-white rounded-lg font-medium transition whitespace-nowrap">
                            Pesquisar
                        </button>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="px-8 py-3 bg-gradient-to-r from-[#00CAFC] to-[#0056E2] hover:opacity-90 text-white rounded-lg font-medium transition flex items-center gap-2 whitespace-nowrap"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Cadastrar
                        </button>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="p-3 hover:bg-white/10 rounded-lg transition"
                        title="Sair"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="px-8 pb-8">
                <div className="max-w-[1400px] mx-auto">
                    {/* Pet Grid */}
                    {isLoading ? (
                        <div className="text-center py-20">
                            <p className="text-white/60 text-lg">Carregando...</p>
                        </div>
                    ) : filteredPets.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-white/60 text-lg">
                                {searchQuery ? 'Nenhum pet encontrado com esse termo.' : 'Você ainda não tem pets cadastrados.'}
                            </p>
                            {!searchQuery && (
                                <p className="text-white/40 mt-2">Clique em "Cadastrar" para adicionar um pet!</p>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="border-2 border-[#0056E2] rounded-2xl p-6 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredPets.map((pet) => (
                                        <PetCardExpandable
                                            key={pet.id}
                                            pet={pet}
                                            isSelected={selectedPetId === pet.id}
                                            onSelect={handleSelectPet}
                                            onEdit={setEditingPet}
                                            onDelete={setDeletingPet}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-end gap-4 text-white">
                                <button className="p-2 hover:bg-white/10 rounded-lg transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <span className="text-sm">1 de {Math.max(1, Math.ceil(filteredPets.length / 16))}</span>
                                <button className="p-2 hover:bg-white/10 rounded-lg transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Modais */}
            <PetCreateModal
                isOpen={isCreating}
                onClose={() => setIsCreating(false)}
                onSubmit={handleCreateSubmit}
                isLoading={isCreateLoading}
            />

            <PetEditModal
                isOpen={!!editingPet}
                pet={editingPet}
                onClose={() => setEditingPet(null)}
                onSubmit={handleEditSubmit}
                isLoading={isEditLoading}
            />

            <PetDeleteModal
                isOpen={!!deletingPet}
                pet={deletingPet}
                onClose={() => setDeletingPet(null)}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleteLoading}
            />
        </div>
    );
}
