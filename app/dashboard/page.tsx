'use client';

import { usePets } from '@/hooks/usePets';
import PetList from '../components/PetList';
import PetDeleteModal from '../components/PetDeleteModal';
import PetEditModal from '../components/PetEditModal';
import PetCreateModal from '../components/PetCreateModal';

/**
 * Dashboard Page - Refatorado seguindo Clean Code
 * 
 * Antes: 300 linhas com lógica e UI misturados
 * Depois: ~100 linhas focado apenas em composição de UI
 * 
 * Lógica de estado e CRUD extraída para usePets hook
 * Renderização do grid extraída para PetList component
 */
export default function DashboardPage() {
    const {
        // Estado
        pets,
        currentUserId,
        isLoading,

        // Busca
        searchQuery,
        setSearchQuery,

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
    } = usePets();

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
                    {isLoading ? (
                        <div className="text-center py-20">
                            <p className="text-white/60 text-lg">Carregando...</p>
                        </div>
                    ) : (
                        <PetList
                            pets={pets}
                            currentUserId={currentUserId}
                            selectedPetId={selectedPetId}
                            hasSearchQuery={searchQuery.length > 0}
                            onSelectPet={handleSelectPet}
                            onEditPet={setEditingPet}
                            onDeletePet={setDeletingPet}
                        />
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
