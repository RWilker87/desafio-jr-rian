'use client';

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

interface PetDeleteModalProps {
    isOpen: boolean;
    pet: Pet | null;
    onClose: () => void;
    onConfirm: (petId: string) => Promise<void>;
    isLoading: boolean;
}

// Função para calcular idade
function calculateAge(birthDateString: string): number {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Função para formatar data
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

export default function PetDeleteModal({ isOpen, pet, onClose, onConfirm, isLoading }: PetDeleteModalProps) {
    if (!pet) return null;

    const handleConfirm = async () => {
        await onConfirm(pet.id);
    };

    const age = calculateAge(pet.birthDate);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Remover Pet"
            icon={
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </div>
            }
        >
            {/* Dados do Pet */}
            <div className="space-y-4 mb-6">
                {/* Nome */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Nome</p>
                    <p className="text-lg font-semibold text-gray-800">{pet.name}</p>
                </div>

                {/* Tipo, Raça e Idade */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Tipo</p>
                        <p className="text-lg font-semibold text-gray-800">
                            {pet.type === 'DOG' ? '🐕 Cachorro' : '🐈 Gato'}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Raça</p>
                        <p className="text-base font-semibold text-gray-800">{pet.breed}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Idade</p>
                        <p className="text-lg font-semibold text-gray-800">
                            {age} {age === 1 ? 'ano' : 'anos'}
                        </p>
                    </div>
                </div>

                {/* Data de Nascimento */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Data de Nascimento</p>
                    <p className="text-base font-semibold text-gray-800">{formatDate(pet.birthDate)}</p>
                </div>

                {/* Dono e Telefone */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Dono</p>
                        <p className="text-base font-semibold text-gray-800">{pet.ownerName}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Telefone</p>
                        <p className="text-base font-semibold text-gray-800">{pet.ownerPhone}</p>
                    </div>
                </div>

                {/* Descrição (se existir) */}
                {pet.description && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Descrição</p>
                        <p className="text-base text-gray-800">{pet.description}</p>
                    </div>
                )}
            </div>

            {/* Mensagem de Confirmação */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-center text-red-800 font-medium">
                    Tem certeza que deseja remover este pet?
                </p>
                <p className="text-center text-red-600 text-sm mt-1">
                    Esta ação não pode ser desfeita.
                </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Voltar
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Removendo...' : 'Remover'}
                </button>
            </div>
        </BaseModal>
    );
}
