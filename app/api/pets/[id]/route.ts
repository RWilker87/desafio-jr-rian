import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { petSchema } from '@/lib/validations/pet';

// GET /api/pets/[id] - Buscar um pet específico
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const { id } = await params;

        const pet = await prisma.pet.findUnique({
            where: { id },
        });

        if (!pet) {
            return NextResponse.json(
                { error: 'Pet não encontrado' },
                { status: 404 }
            );
        }

        // Verificar se o pet pertence ao usuário
        if (pet.userId !== user.userId) {
            return NextResponse.json(
                { error: 'Acesso negado' },
                { status: 403 }
            );
        }

        return NextResponse.json({ pet });
    } catch (error) {
        console.error('Erro ao buscar pet:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// PUT /api/pets/[id] - Atualizar pet
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Buscar pet
        const existingPet = await prisma.pet.findUnique({
            where: { id },
        });

        if (!existingPet) {
            return NextResponse.json(
                { error: 'Pet não encontrado' },
                { status: 404 }
            );
        }

        // REGRA: Verificar se o pet pertence ao usuário
        if (existingPet.userId !== user.userId) {
            return NextResponse.json(
                { error: 'Você não tem permissão para editar este pet' },
                { status: 403 }
            );
        }

        const body = await request.json();

        // Validar com Zod
        const validatedData = petSchema.parse(body);

        // Atualizar pet
        const pet = await prisma.pet.update({
            where: { id },
            data: {
                name: validatedData.name,
                type: validatedData.type,
                breed: validatedData.breed,
                birthDate: new Date(validatedData.birthDate),
                description: validatedData.description || null,
                ownerName: validatedData.ownerName,
                ownerPhone: validatedData.ownerPhone,
            },
        });

        return NextResponse.json({ pet });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Dados inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Erro ao atualizar pet:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// DELETE /api/pets/[id] - Deletar pet
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Buscar pet
        const existingPet = await prisma.pet.findUnique({
            where: { id },
        });

        if (!existingPet) {
            return NextResponse.json(
                { error: 'Pet não encontrado' },
                { status: 404 }
            );
        }

        // REGRA: Verificar se o pet pertence ao usuário
        if (existingPet.userId !== user.userId) {
            return NextResponse.json(
                { error: 'Você não tem permissão para deletar este pet' },
                { status: 403 }
            );
        }

        // Deletar pet
        await prisma.pet.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: 'Pet deletado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar pet:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
