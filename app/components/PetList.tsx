'use client';

import type { Pet, PetListProps } from '@/types';
import PetCardExpandable from './PetCardExpandable';

/**
 * Componente para renderização do grid de pets
 * Responsabilidade única: exibir lista de pets com estados vazios
 */

export default function PetList({
    pets,
    currentUserId,
    selectedPetId,
    searchQuery,
    onSelectPet,
    onEditPet,
    onDeletePet,
}: PetListProps) {
    // Filtrar pets baseado na busca
    const filteredPets = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Estado vazio - sem pets
    if (filteredPets.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-white/60 text-lg">
                    {searchQuery
                        ? 'Nenhum pet encontrado com esse termo.'
                        : 'Você ainda não tem pets cadastrados.'
                    }
                </p>
                {!searchQuery && (
                    <p className="text-white/40 mt-2">
                        Clique em "Cadastrar" para adicionar um pet!
                    </p>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="border-2 border-[#0056E2] rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPets.map((pet) => (
                        <PetCardExpandable
                            key={pet.id}
                            pet={pet}
                            isSelected={selectedPetId === pet.id}
                            isOwner={currentUserId === pet.userId}
                            onSelect={onSelectPet}
                            onEdit={onEditPet}
                            onDelete={onDeletePet}
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
    );
}
