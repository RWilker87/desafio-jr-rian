import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations/auth';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validar com Zod
        const validatedData = loginSchema.parse(body);

        // Buscar usuário
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Email ou senha inválidos' },
                { status: 401 }
            );
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(
            validatedData.password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Email ou senha inválidos' },
                { status: 401 }
            );
        }

        // Criar token JWT
        const token = signToken({
            userId: user.id,
            email: user.email,
        });

        // Criar resposta com cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
            },
        });

        // Setar cookie httpOnly no response
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: '/',
        });

        return response;
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Dados inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Erro no login:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
