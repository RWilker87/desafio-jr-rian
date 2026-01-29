import { z } from 'zod';

export const petSchema = z.object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }),
    type: z.enum(['DOG', 'CAT'], { message: 'Tipo deve ser DOG ou CAT' }),
    age: z.number().int().min(0, { message: 'Idade deve ser maior ou igual a 0' }),
    description: z.string().optional(),
});

export type PetInput = z.infer<typeof petSchema>;
