'use client';

interface Pet {
    id: string;
    name: string;
    type: 'DOG' | 'CAT';
    breed: string;
    birthDate: string;
    description: string | null;
    ownerName: string;
    ownerPhone: string;
    userId: string;
    createdAt: string;
}

interface PetCardExpandableProps {
    pet: Pet;
    isSelected: boolean;
    isOwner: boolean;
    onSelect: (petId: string) => void;
    onEdit: (pet: Pet) => void;
    onDelete: (pet: Pet) => void;
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

export default function PetCardExpandable({
    pet,
    isSelected,
    isOwner,
    onSelect,
    onEdit,
    onDelete
}: PetCardExpandableProps) {
    const { years, date } = calculateAge(pet.birthDate);

    return (
        <div className="w-full">
            {/* Card Principal */}
            <button
                onClick={() => onSelect(pet.id)}
                className={`
                    w-full bg-[#001E4D]/50 backdrop-blur-sm rounded-xl p-5
                    relative
                    transition-all duration-200
                    hover:ring-2 hover:ring-[#00CAFC] 
                    hover:shadow-[0_0_12px_2px_rgba(0,202,252,0.35)]
                    ${isSelected
                        ? 'ring-2 ring-[#00CAFC] shadow-[0_0_12px_2px_rgba(0,202,252,0.35)]'
                        : ''
                    }
                `}
            >
                {/* Badge "Seu Pet" */}
                {isOwner && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-[#00CAFC] to-[#0056E2] px-3 py-1 rounded-full flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white text-xs font-bold">Seu Pet</span>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00CAFC] to-[#0056E2] flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">
                            {pet.type === 'DOG' ? '🐕' : '🐈'}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-white/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-white font-medium truncate">{pet.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-white/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="text-white/70 text-sm truncate">{pet.ownerName}</p>
                        </div>
                    </div>

                    {/* Chevron */}
                    <svg
                        className={`w-6 h-6 text-white transition-transform duration-200 flex-shrink-0 ${isSelected ? 'rotate-180' : ''
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Painel Expandido */}
            {isSelected && (
                <div
                    className="mt-3 bg-[#001E4D]/50 backdrop-blur-sm rounded-xl p-5 border-2 border-[#00CAFC] shadow-[0_0_12px_2px_rgba(0,202,252,0.35)] animate-fadeIn"
                >
                    {/* Detalhes */}
                    <div className="space-y-3 mb-4">
                        {/* Raça */}
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-white/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="text-white text-sm">
                                <span className="text-white/60">Raça:</span> {pet.breed}
                            </span>
                        </div>

                        {/* Telefone */}
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-white/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-white text-sm">
                                <span className="text-white/60">Telefone:</span> {pet.ownerPhone}
                            </span>
                        </div>

                        {/* Idade */}
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-white/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-white text-sm">
                                <span className="text-white/60">Idade:</span> {years} {years === 1 ? 'Ano' : 'Anos'} ({date})
                            </span>
                        </div>
                    </div>

                    {/* Mostrar alerta se não for dono */}
                    {!isOwner && (
                        <div className="mb-4 bg-[#404A5C]/30 border border-[#404A5C]/50 rounded-lg p-3">
                            <p className="text-white/70 text-sm text-center">
                                ℹ️ Você pode visualizar, mas não pode editar ou remover este pet
                            </p>
                        </div>
                    )}

                    {/* Botões */}
                    <div className="flex gap-3">
                        {/* Botão Editar */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isOwner) onEdit(pet);
                            }}
                            disabled={!isOwner}
                            className={`flex-1 px-4 py-3 font-semibold rounded-lg transition flex items-center justify-center gap-2 ${isOwner
                                    ? 'bg-white hover:bg-gray-100 text-[#0056E2] cursor-pointer'
                                    : 'bg-[#404A5C]/30 text-white/40 cursor-not-allowed'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                        </button>

                        {/* Botão Remover */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isOwner) onDelete(pet);
                            }}
                            disabled={!isOwner}
                            className={`flex-1 px-4 py-3 font-semibold rounded-lg transition flex items-center justify-center gap-2 ${isOwner
                                    ? 'bg-gradient-to-r from-[#00CAFC] to-[#0056E2] hover:opacity-90 text-white cursor-pointer'
                                    : 'bg-[#404A5C]/30 text-white/40 cursor-not-allowed'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remover
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
