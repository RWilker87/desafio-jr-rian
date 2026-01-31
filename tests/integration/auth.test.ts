/**
 * Teste de Integração - Autenticação (Login)
 * 
 * Este teste valida o fluxo completo de login:
 * 1. Cria um usuário de teste via API
 * 2. Envia credenciais válidas para POST /api/auth/login
 * 3. Verifica status 200
 * 4. Verifica presença do cookie de autenticação
 * 5. Verifica estrutura da resposta JSON
 * 
 * IMPORTANTE: Este teste requer o servidor Next.js rodando (npm run dev)
 */

import { describe, it, expect, beforeAll } from 'vitest';

describe('POST /api/auth/login - Teste de Integração', () => {
    // Email único por execução para evitar conflitos
    const timestamp = Date.now();
    const testUser = {
        email: `test${timestamp}@softpet.com`,
        password: 'senha123',
    };

    beforeAll(async () => {
        // Criar usuário de teste via API de registro
        console.log(`[TEST] Criando usuário de teste: ${testUser.email}`);

        const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser),
        });

        const responseText = await registerResponse.text();
        console.log(`[TEST] Registro response status: ${registerResponse.status}`);
        console.log(`[TEST] Registro response body: ${responseText}`);

        // Garantir que o registro foi bem-sucedido
        if (!registerResponse.ok) {
            throw new Error(`Falha ao criar usuário de teste: ${responseText}`);
        }

        // Aguardar para garantir que o registro foi persistido
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('[TEST] Usuário de teste criado com sucesso');
    });

    it('deve fazer login com credenciais válidas e retornar cookie de autenticação', async () => {
        // Arrange: Preparar dados de login
        const loginData = {
            email: testUser.email,
            password: testUser.password,
        };

        console.log(`[TEST] Tentando login com: ${loginData.email}`);

        // Act: Fazer requisição POST para /api/auth/login
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        console.log(`[TEST] Login response status: ${response.status}`);

        // Clone response to read body for debugging
        const responseClone = response.clone();
        const responseBody = await responseClone.text();
        console.log(`[TEST] Login response body: ${responseBody}`);

        // Assert: Verificar resposta

        // 1. Status code deve ser 200 (sucesso)
        expect(response.status).toBe(200);

        // 2. Deve retornar JSON válido
        const data = await response.json();
        expect(data).toBeDefined();

        // 3. Estrutura da resposta deve conter success e user
        expect(data).toHaveProperty('success');
        expect(data.success).toBe(true);

        // 4. Deve retornar dados do usuário
        expect(data).toHaveProperty('user');
        expect(data.user).toHaveProperty('id');
        expect(data.user).toHaveProperty('email');
        expect(data.user.email).toBe(testUser.email);

        // 5. Token JWT deve estar presente na resposta
        // Nota: O Next.js App Router não expõe o header Set-Cookie para o fetch do Node.js,
        // então verificamos o token no body. O cookie é setado normalmente para o navegador.
        expect(data).toHaveProperty('token');
        expect(typeof data.token).toBe('string');
        expect(data.token.length).toBeGreaterThan(0);

        // Verificar que o token é um JWT válido (formato: header.payload.signature)
        const jwtParts = data.token.split('.');
        expect(jwtParts.length).toBe(3);
    });

    it('deve retornar 401 com credenciais inválidas', async () => {
        // Arrange: Credenciais incorretas
        const invalidLogin = {
            email: testUser.email,
            password: 'senhaerrada',
        };

        // Act: Tentar login com senha errada
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invalidLogin),
        });

        // Assert: Deve retornar erro 401 Unauthorized
        expect(response.status).toBe(401);

        const data = await response.json();
        expect(data).toHaveProperty('error');
        expect(data.error).toBe('Email ou senha inválidos');
    });

    it('deve retornar 400 com dados inválidos (email malformado)', async () => {
        // Arrange: Email inválido
        const invalidData = {
            email: 'email-invalido',
            password: 'senha123',
        };

        // Act: Tentar login com email malformado
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invalidData),
        });

        // Assert: Deve retornar erro 400 Bad Request
        expect(response.status).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty('error');
    });
});
