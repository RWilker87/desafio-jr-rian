'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Link from 'next/link';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

export default function LoginPage() {
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
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Erro ao fazer login');
                return;
            }

            // Sucesso - redirecionar para dashboard
            window.location.href = '/dashboard';
        } catch (err) {
            setError('Erro ao conectar com o servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0E0014] to-[#001E4D] px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-2">SoftPet</h1>
                    <p className="text-white/60">Gerenciamento de Pets</p>
                </div>

                {/* Card de Login */}
                <div className="bg-[#001E4D] border-4 border-[#00CAFC] rounded-3xl shadow-[0_0_20px_4px_rgba(0,202,252,0.35)] p-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#00CAFC] to-[#0056E2] rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Bem-vindo!</h2>
                            <p className="text-white/60 text-sm">Faça login para continuar</p>
                        </div>
                    </div>

                    {/* Erro */}
                    {error && (
                        <div className="bg-[#ED254E]/10 border-2 border-[#ED254E]/30 rounded-xl p-4 mb-6">
                            <p className="text-[#ED254E] text-sm text-center font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2 font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                className="w-full px-4 py-3 bg-transparent border-2 border-[#0056E2]/50 rounded-xl text-white placeholder-[#404A5C] focus:border-[#00CAFC] focus:outline-none transition"
                                placeholder="seu@email.com"
                            />
                            {errors.email && (
                                <p className="text-[#ED254E] text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Senha */}
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2 font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password')}
                                className="w-full px-4 py-3 bg-transparent border-2 border-[#0056E2]/50 rounded-xl text-white placeholder-[#404A5C] focus:border-[#00CAFC] focus:outline-none transition"
                                placeholder="Digite sua senha"
                            />
                            {errors.password && (
                                <p className="text-[#ED254E] text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Botão */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-8 py-3 bg-gradient-to-r from-[#00CAFC] to-[#0056E2] hover:opacity-90 text-white font-bold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    {/* Link para Registro */}
                    <div className="mt-6 text-center">
                        <p className="text-white/60 text-sm">
                            Não tem uma conta?{' '}
                            <Link href="/register" className="text-[#00CAFC] hover:text-[#00CAFC]/80 font-semibold transition">
                                Criar conta
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-white/40 text-xs mt-8">
                    © 2026 SoftPet. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}
