'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Link from 'next/link';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';

export default function RegisterPage() {
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Erro ao registrar');
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

                {/* Card de Registro */}
                <div className="bg-[#001E4D] border-4 border-[#00CAFC] rounded-3xl shadow-[0_0_20px_4px_rgba(0,202,252,0.35)] p-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#00CAFC] to-[#0056E2] rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Criar Conta</h2>
                            <p className="text-white/60 text-sm">Junte-se ao SoftPet</p>
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
                                placeholder="Mínimo 6 caracteres"
                            />
                            {errors.password && (
                                <p className="text-[#ED254E] text-xs mt-1">{errors.password.message}</p>
                            )}
                            <p className="text-white/40 text-xs mt-1">
                                A senha deve ter no mínimo 6 caracteres
                            </p>
                        </div>

                        {/* Botão */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-8 py-3 bg-gradient-to-r from-[#00CAFC] to-[#0056E2] hover:opacity-90 text-white font-bold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Criando conta...' : 'Criar Conta'}
                        </button>
                    </form>

                    {/* Link para Login */}
                    <div className="mt-6 text-center">
                        <p className="text-white/60 text-sm">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="text-[#00CAFC] hover:text-[#00CAFC]/80 font-semibold transition">
                                Fazer login
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
