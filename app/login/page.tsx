'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true);
        setError('');

        try {
            console.log('Enviando requisição de login...');
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            console.log('Status da resposta:', response.status);
            console.log('Response OK:', response.ok);

            const result = await response.json();
            console.log('Resultado:', result);

            if (!response.ok) {
                console.log('Erro no login:', result.error);
                setError(result.error || 'Erro ao fazer login');
                return;
            }

            // Sucesso - redirecionar para dashboard
            console.log('Login bem-sucedido! Redirecionando...');
            // Usar window.location.href em vez de router.push para garantir que o cookie seja enviado
            window.location.href = '/dashboard';
        } catch (err) {
            console.error('Erro ao conectar:', err);
            setError('Erro ao conectar com o servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo!</h1>
                <p className="text-gray-600 mb-6">Faça login para continuar</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            placeholder="seu@email.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            placeholder="Digite sua senha"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Carregando...' : 'Entrar'}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Não tem uma conta?{' '}
                    <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                        Criar conta
                    </Link>
                </p>
            </div>
        </div>
    );
}
