/**
 * Tipos centralizados do projeto SoftPet
 * Seguindo princípio DRY - Don't Repeat Yourself
 */

// ============================================
// Tipos de Domínio - Pet
// ============================================

export type PetType = 'DOG' | 'CAT';

export interface Pet {
    id: string;
    name: string;
    type: PetType;
    breed: string;
    birthDate: string;
    description: string | null;
    ownerName: string;
    ownerPhone: string;
    userId: string;
    createdAt: string;
}

// ============================================
// Tipos de Domínio - User
// ============================================

export interface User {
    id: string;
    email: string;
}

// ============================================
// Props de Componentes
// ============================================

export interface PetCardExpandableProps {
    pet: Pet;
    isSelected: boolean;
    isOwner: boolean;
    onSelect: (petId: string) => void;
    onEdit: (pet: Pet) => void;
    onDelete: (pet: Pet) => void;
}

