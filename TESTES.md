# 🧪 Guia de Testes - Pet Manager

Este guia contém os passos para testar todas as funcionalidades do sistema.

## ✅ Pré-requisitos

- [x] PostgreSQL rodando
- [x] Banco de dados criado
- [x] Migrations executadas (`npx prisma migrate dev`)
- [x] Servidor rodando (`npm run dev`)

## 🔐 Teste 1: Autenticação

### 1.1 - Registro de Usuário

1. Acesse: `http://localhost:3000`
2. Clique em **"Criar Conta"**
3. Preencha:
   - Email: `teste@exemplo.com`
   - Senha: `123456` (ou qualquer senha com 6+ caracteres)
4. Clique em **"Criar Conta"**

**Resultado esperado:**
- ✅ Redirecionamento para `/dashboard`
- ✅ Cookie `auth_token` definido (veja no DevTools → Application → Cookies)
- ✅ Email do usuário aparece no header

### 1.2 - Testar Email Duplicado

1. Faça logout
2. Tente registrar o mesmo email novamente

**Resultado esperado:**
- ✅ Erro: "Email já está em uso"

### 1.3 - Login

1. Em `/login`, use as credenciais criadas
2. Clique em **"Entrar"**

**Resultado esperado:**
- ✅ Redirecionamento para `/dashboard`
- ✅ Sessão restaurada

### 1.4 - Login com Credenciais Inválidas

1. Tente login com senha errada

**Resultado esperado:**
- ✅ Erro: "Email ou senha inválidos"

### 1.5 - Proteção de Rotas

1. Faça logout
2. Tente acessar `http://localhost:3000/dashboard` diretamente

**Resultado esperado:**
- ✅ Redirecionamento automático para `/login`

### 1.6 - Logout

1. No dashboard, clique em **"Sair"**

**Resultado esperado:**
- ✅ Redirecionamento para `/login`
- ✅ Cookie removido

## 🐾 Teste 2: CRUD de Pets

### 2.1 - Criar Pet (Cachorro)

1. Faça login
2. No dashboard, clique em **"+ Adicionar Pet"**
3. Preencha:
   - Nome: `Rex`
   - Tipo: `🐕 Cachorro`
   - Idade: `3`
   - Descrição: `Labrador muito amigável`
4. Clique em **"Criar Pet"**

**Resultado esperado:**
- ✅ Pet aparece na lista
- ✅ Card com nome "Rex", emoji 🐕, idade "3 anos"

### 2.2 - Criar Pet (Gato)

1. Clique em **"+ Adicionar Pet"** novamente
2. Preencha:
   - Nome: `Mimi`
   - Tipo: `🐈 Gato`
   - Idade: `1`
   - Descrição: *(deixe vazio)*
3. Clique em **"Criar Pet"**

**Resultado esperado:**
- ✅ Pet "Mimi" aparece na lista com emoji 🐈

### 2.3 - Validação de Formulário

1. Tente criar um pet sem nome
2. Tente criar um pet com idade negativa

**Resultado esperado:**
- ✅ Mensagens de erro aparecem abaixo dos campos
- ✅ Formulário não é enviado

### 2.4 - Editar Pet

1. Clique em **"Editar"** no card do Rex
2. Mude a idade para `4`
3. Mude a descrição para `Labrador muito brincalhão`
4. Clique em **"Atualizar"**

**Resultado esperado:**
- ✅ Pet atualizado com novos dados
- ✅ Formulário de edição fecha

### 2.5 - Cancelar Edição

1. Clique em **"Editar"** em qualquer pet
2. Clique em **"Cancelar"**

**Resultado esperado:**
- ✅ Formulário fecha sem alterações

### 2.6 - Deletar Pet

1. Clique em **"Deletar"** no card da Mimi
2. Confirme na caixa de diálogo

**Resultado esperado:**
- ✅ Pet removido da lista

## 🔒 Teste 3: Controle de Acesso (403)

Este teste verifica se usuários só podem editar/deletar seus próprios pets.

### 3.1 - Criar Segundo Usuário

1. Faça logout
2. Registre um novo usuário: `teste2@exemplo.com`
3. Crie um pet qualquer como esse usuário

### 3.2 - Tentar Editar Pet de Outro Usuário (via API)

Você pode testar via DevTools Console ou Postman:

\`\`\`javascript
// No console do navegador (F12):
// Primeiro, pegue o ID de um pet do usuário 1
// (você pode ver no DevTools → Network ao clicar em Editar)

fetch('/api/pets/ID_DO_PET_DO_USUARIO_1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Tentando hackear',
    type: 'DOG',
    age: 5
  })
}).then(r => r.json()).then(console.log);
\`\`\`

**Resultado esperado:**
- ✅ Status 403
- ✅ Erro: "Você não tem permissão para editar este pet"

### 3.3 - Tentar Deletar Pet de Outro Usuário

\`\`\`javascript
fetch('/api/pets/ID_DO_PET_DO_USUARIO_1', {
  method: 'DELETE'
}).then(r => r.json()).then(console.log);
\`\`\`

**Resultado esperado:**
- ✅ Status 403
- ✅ Erro: "Você não tem permissão para deletar este pet"

## 🎨 Teste 4: Interface

### 4.1 - Responsividade

1. Abra o DevTools (F12)
2. Mude para visualização mobile (Ctrl+Shift+M)
3. Navegue pelas páginas

**Resultado esperado:**
- ✅ Layout se adapta para mobile
- ✅ Formulários permanecem usáveis
- ✅ Cards de pets empilham verticalmente

### 4.2 - Estados de Loading

1. Ao submeter formulários, observe o botão

**Resultado esperado:**
- ✅ Botão mostra "Carregando..." ou "Salvando..."
- ✅ Botão fica desabilitado durante envio

## 📊 Teste 5: Banco de Dados

### 5.1 - Verificar no Prisma Studio

\`\`\`bash
npx prisma studio
\`\`\`

Acesse: `http://localhost:5555`

**Verificar:**
- ✅ Tabela User com emails e passwordHash (não em texto puro)
- ✅ Tabela Pet com relação userId
- ✅ Enum PetType (DOG, CAT)

### 5.2 - Cascade Delete

1. No Prisma Studio, delete um usuário

**Resultado esperado:**
- ✅ Todos os pets desse usuário são deletados automaticamente

## 🐛 Teste 6: Casos de Erro

### 6.1 - Token JWT Inválido

1. No DevTools → Application → Cookies
2. Edite manualmente o valor do cookie `auth_token`
3. Tente acessar `/dashboard`

**Resultado esperado:**
- ✅ Redirecionamento para `/login`

### 6.2 - Banco de Dados Offline

1. Pare o PostgreSQL
2. Tente criar um pet

**Resultado esperado:**
- ✅ Erro 500: "Erro interno do servidor"
- ✅ Console mostra erro de conexão com o banco

## ✅ Checklist Final

Depois de executar todos os testes, verifique:

- [ ] Registro funciona
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Middleware protege rotas privadas
- [ ] Criar pet funciona
- [ ] Listar pets funciona
- [ ] Editar pet funciona
- [ ] Deletar pet funciona
- [ ] Validação com Zod funciona (frontend e backend)
- [ ] Controle de acesso 403 funciona
- [ ] Senhas estão hasheadas no banco
- [ ] JWT está em cookie httpOnly
- [ ] Interface é responsiva
- [ ] Estados de loading funcionam

---

## 🚨 Problemas Comuns

### "Erro ao conectar com o servidor"
- Verifique se PostgreSQL está rodando
- Confira a `DATABASE_URL` no `.env`

### "Prisma Client não encontrado"
- Execute: `npx prisma generate`

### "Migration failed"
- Verifique se o banco existe
- Tente: `npx prisma migrate reset` (⚠️ apaga dados)

### Middleware não funciona
- A rota está em `/dashboard/*` ou `/pets/*`?
- Verifique se o cookie está presente

---

🎉 **Se todos os testes passaram, parabéns! O sistema está funcionando perfeitamente!**
