import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { petSchema } from '@/lib/validations/pet';

// GET /api/pets - Listar todos os pets do usuário autenticado
export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const pets = await prisma.pet.findMany({
            where: { userId: user.userId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ pets });
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
                ...validatedData,
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
