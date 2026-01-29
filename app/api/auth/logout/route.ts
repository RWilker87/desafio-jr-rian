import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/cookies';

export async function POST() {
    try {
        await removeAuthCookie();

        return NextResponse.json({
            success: true,
            message: 'Logout realizado com sucesso',
        });
    } catch (error) {
        console.error('Erro no logout:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
