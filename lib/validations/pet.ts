import { z } from 'zod';

export const petSchema = z.object({
    name: z.string().min(1, { message: 'Nome do pet é obrigatório' }),
    type: z.enum(['DOG', 'CAT'], { message: 'Tipo deve ser Cachorro ou Gato' }),
    breed: z.string().min(1, { message: 'Raça é obrigatória' }),
    birthDate: z.string().min(1, { message: 'Data de nascimento é obrigatória' }),
    description: z.string().optional(),
    ownerName: z.string().min(3, { message: 'Nome do dono deve ter no mínimo 3 caracteres' }),
    ownerPhone: z.string().min(14, { message: 'Telefone é obrigatório' }),
});

export type PetInput = z.infer<typeof petSchema>;
