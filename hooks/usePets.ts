'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Pet, User } from '@/types';
import type { PetInput } from '@/lib/validations/pet';

/**
 * Hook para gerenciar estado e operações CRUD de pets
 * Seguindo princípio SoC - Separation of Concerns
 */

interface UsePetsReturn {
    // Estado principal
    pets: Pet[];
    user: User | null;
    currentUserId: string | null;
    isLoading: boolean;

    // Busca
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredPets: Pet[];

    // Estado de modais
    isCreating: boolean;
    setIsCreating: (value: boolean) => void;
    editingPet: Pet | null;
    setEditingPet: (pet: Pet | null) => void;
    deletingPet: Pet | null;
    setDeletingPet: (pet: Pet | null) => void;

    // Estados de loading das operações
    isCreateLoading: boolean;
    isEditLoading: boolean;
    isDeleteLoading: boolean;

    // Seleção de pet
    selectedPetId: string | null;
    handleSelectPet: (petId: string) => void;

    // Operações CRUD
    handleCreateSubmit: (data: PetInput) => Promise<void>;
    handleEditSubmit: (data: PetInput) => Promise<void>;
    handleDeleteConfirm: (petId: string) => Promise<void>;
    handleLogout: () => Promise<void>;
}

export function usePets(): UsePetsReturn {
    // Estado principal
    const [user, setUser] = useState<User | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Busca
    const [searchQuery, setSearchQuery] = useState('');

    // Estado de modais
    const [isCreating, setIsCreating] = useState(false);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [deletingPet, setDeletingPet] = useState<Pet | null>(null);

    // Estados de loading
    const [isCreateLoading, setIsCreateLoading] = useState(false);
    const [isEditLoading, setIsEditLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    // Seleção
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    // Fetch user data
    const fetchUser = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
        }
    }, []);

    // Fetch pets
    const fetchPets = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/pets');
            if (response.ok) {
                const data = await response.json();
                setPets(data.pets);
                setCurrentUserId(data.currentUserId);
            }
        } catch (error) {
            console.error('Erro ao buscar pets:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchUser();
        fetchPets();
    }, [fetchUser, fetchPets]);

    // Pets filtrados por busca
    const filteredPets = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const handleSelectPet = useCallback((petId: string) => {
        setSelectedPetId(prev => prev === petId ? null : petId);
    }, []);

    const handleCreateSubmit = useCallback(async (data: PetInput) => {
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
        } catch {
            alert('Erro ao criar pet');
        } finally {
            setIsCreateLoading(false);
        }
    }, [fetchPets]);

    const handleEditSubmit = useCallback(async (data: PetInput) => {
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
        } catch {
            alert('Erro ao atualizar pet');
        } finally {
            setIsEditLoading(false);
        }
    }, [editingPet, fetchPets]);

    const handleDeleteConfirm = useCallback(async (petId: string) => {
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
        } catch {
            alert('Erro ao deletar pet');
        } finally {
            setIsDeleteLoading(false);
        }
    }, [fetchPets]);

    const handleLogout = useCallback(async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    }, []);

    return {
        // Estado principal
        pets,
        user,
        currentUserId,
        isLoading,

        // Busca
        searchQuery,
        setSearchQuery,
        filteredPets,

        // Modais
        isCreating,
        setIsCreating,
        editingPet,
        setEditingPet,
        deletingPet,
        setDeletingPet,

        // Loading states
        isCreateLoading,
        isEditLoading,
        isDeleteLoading,

        // Seleção
        selectedPetId,
        handleSelectPet,

        // Operações
        handleCreateSubmit,
        handleEditSubmit,
        handleDeleteConfirm,
        handleLogout,
    };
}
