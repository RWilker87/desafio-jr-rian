import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { petSchema } from '@/lib/validations/pet';

// GET /api/pets - Listar TODOS os pets com suporte a busca
// Query params: ?q=termo (busca por nome do pet OU nome do dono)
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        // Obter query param de busca
        const { searchParams } = new URL(request.url);
        const searchQuery = searchParams.get('q')?.trim();

        // Construir filtro de busca
        const whereClause = searchQuery
            ? {
                OR: [
                    { name: { contains: searchQuery, mode: 'insensitive' as const } },
                    { ownerName: { contains: searchQuery, mode: 'insensitive' as const } },
                ],
            }
            : {};

        // Buscar pets com filtro opcional
        const pets = await prisma.pet.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ pets, currentUserId: user.userId });
    } catch (error) {
        console.error('Erro ao listar pets:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}


// POST /api/pets - Criar novo pet
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validar com Zod
        const validatedData = petSchema.parse(body);

        // Criar pet associado ao usuário
        const pet = await prisma.pet.create({
            data: {
                name: validatedData.name,
                type: validatedData.type,
                breed: validatedData.breed,
                birthDate: new Date(validatedData.birthDate),
                description: validatedData.description || null,
                ownerName: validatedData.ownerName,
                ownerPhone: validatedData.ownerPhone,
                userId: user.userId,
            },
        });

        return NextResponse.json({ pet }, { status: 201 });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Dados inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Erro ao criar pet:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
