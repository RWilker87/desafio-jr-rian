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
function calculateAge(birthDateString: string): { years: number; date: string } {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        years--;
    }

    const date = birthDate.toLocaleDateString('pt-BR');
    return { years, date };
}

export default function PetDeleteModal({ isOpen, pet, onClose, onConfirm, isLoading }: PetDeleteModalProps) {
    if (!pet || !isOpen) return null;

    const handleConfirm = async () => {
        await onConfirm(pet.id);
    };

    const { years, date } = calculateAge(pet.birthDate);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Remover Pet"
            borderColor="red"
            maxWidth="max-w-2xl"
            icon={
                <div className="w-20 h-20 bg-[#ED254E] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
            }
        >
            {/* Pet Info */}
            <div className="space-y-4 mb-6">
                {/* Nome */}
                <div className="bg-[#0056E2]/20 border border-[#0056E2]/30 rounded-xl p-4">
                    <p className="text-sm text-white/60 mb-1">Nome</p>
                    <p className="text-lg font-semibold text-white">{pet.name}</p>
                </div>

                {/* Tipo, Raça e Idade */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-[#0056E2]/20 border border-[#0056E2]/30 rounded-xl p-4">
                        <p className="text-sm text-white/60 mb-1">Tipo</p>
                        <p className="text-lg font-semibold text-white">
                            {pet.type === 'DOG' ? '🐕 Cachorro' : '🐈 Gato'}
                        </p>
                    </div>
                    <div className="bg-[#0056E2]/20 border border-[#0056E2]/30 rounded-xl p-4">
                        <p className="text-sm text-white/60 mb-1">Raça</p>
                        <p className="text-base font-semibold text-white">{pet.breed}</p>
                    </div>
                    <div className="bg-[#0056E2]/20 border border-[#0056E2]/30 rounded-xl p-4">
                        <p className="text-sm text-white/60 mb-1">Idade</p>
                        <p className="text-lg font-semibold text-white">
                            {years} {years === 1 ? 'ano' : 'anos'}
                        </p>
                    </div>
                </div>

                {/* Data de Nascimento */}
                <div className="bg-[#0056E2]/20 border border-[#0056E2]/30 rounded-xl p-4">
                    <p className="text-sm text-white/60 mb-1">Data de Nascimento</p>
                    <p className="text-base font-semibold text-white">{date}</p>
                </div>

                {/* Dono e Telefone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0056E2]/20 border border-[#0056E2]/30 rounded-xl p-4">
                        <p className="text-sm text-white/60 mb-1">Dono</p>
                        <p className="text-base font-semibold text-white">{pet.ownerName}</p>
                    </div>
                    <div className="bg-[#0056E2]/20 border border-[#0056E2]/30 rounded-xl p-4">
                        <p className="text-sm text-white/60 mb-1">Telefone</p>
                        <p className="text-base font-semibold text-white">{pet.ownerPhone}</p>
                    </div>
                </div>

                {/* Descrição (se existir) */}
                {pet.description && (
                    <div className="bg-[#0056E2]/20 border border-[#0056E2]/30 rounded-xl p-4">
                        <p className="text-sm text-white/60 mb-1">Descrição</p>
                        <p className="text-base text-white">{pet.description}</p>
                    </div>
                )}
            </div>

            {/* Mensagem de Confirmação */}
            <div className="bg-[#ED254E]/10 border-2 border-[#ED254E]/30 rounded-xl p-4 mb-6">
                <p className="text-center text-white font-medium">
                    Tem certeza que deseja remover este pet?
                </p>
                <p className="text-center text-[#ED254E] text-sm mt-1 font-semibold">
                    Esta ação não pode ser desfeita.
                </p>
            </div>

            {/* Botões */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-gray-100 text-[#0056E2] font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="flex-1 px-8 py-3 bg-[#ED254E] hover:bg-[#ED254E]/90 text-white font-bold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Removendo...' : 'Remover'}
                </button>
            </div>
        </BaseModal>
    );
}
