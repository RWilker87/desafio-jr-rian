# 🐾 Pet Manager - Desafio Fullstack Jr

Sistema fullstack completo para gerenciamento de pets, desenvolvido com Next.js 16 (App Router), PostgreSQL, Prisma e autenticação JWT.

## 🚀 Tecnologias Utilizadas

### Backend
- **Next.js 16** (App Router) com API Routes em Node.js
- **PostgreSQL** - Banco de dados relacional
- **Prisma 7** - ORM para TypeScript
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **Zod** - Validação de schemas

### Frontend
- **React 19** com TypeScript
- **Tailwind CSS 4** - Estilização
- **React Hook Form** - Gerenciamento de formulários
- **@hookform/resolvers** - Integração Zod + React Hook Form

## ✨ Funcionalidades

### Autenticação
- ✅ Registro de usuários com email e senha
- ✅ Login com validação de credenciais
- ✅ Logout
- ✅ JWT armazenado em cookie httpOnly
- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ Middleware para proteção de rotas privadas

### CRUD de Pets
- ✅ Criar pets (nome, tipo, idade, descrição)
- ✅ Listar todos os pets do usuário
- ✅ Editar pets
- ✅ Deletar pets
- ✅ **Controle de acesso:** usuário só pode editar/deletar seus próprios pets (retorna 403 caso contrário)
- ✅ Tipos de pet: DOG (cachorro) ou CAT (gato)
- ✅ Relação one-to-many: User → Pets

### Interface
- ✅ Design moderno e responsivo com Tailwind
- ✅ Validação de formulários em tempo real
- ✅ Feedback visual de erros
- ✅ Loading states

## 📁 Estrutura do Projeto

\`\`\`
desafio-jr-rian/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts    # POST - Registrar usuário
│   │   │   ├── login/route.ts       # POST - Login
│   │   │   ├── logout/route.ts      # POST - Logout
│   │   │   └── me/route.ts          # GET - Verificar autenticação
│   │   └── pets/
│   │       ├── route.ts             # GET/POST - Listar e criar pets
│   │       └── [id]/route.ts        # GET/PUT/DELETE - Operações em pet específico
│   ├── components/
│   │   └── PetForm.tsx              # Componente de formulário reutilizável
│   ├── dashboard/
│   │   └── page.tsx                 # Dashboard com CRUD de pets
│   ├── login/
│   │   └── page.tsx                 # Página de login
│   ├── register/
│   │   └── page.tsx                 # Página de registro
│   ├── layout.tsx                   # Layout raiz
│   ├── page.tsx                     # Landing page
│   └── globals.css                  # Estilos globais
├── lib/
│   ├── auth.ts                      # Helper getCurrentUser
│   ├── cookies.ts                   # Helpers de cookies httpOnly
│   ├── jwt.ts                       # Sign e verify JWT
│   ├── prisma.ts                    # Cliente Prisma singleton
│   └── validations/
│       ├── auth.ts                  # Schemas Zod de autenticação
│       └── pet.ts                   # Schemas Zod de pets
├── prisma/
│   ├── schema.prisma                # Schema do banco de dados
│   └── migrations/                  # Migrations
├── middleware.ts                    # Proteção de rotas privadas
├── .env                             # Variáveis de ambiente
└── package.json
\`\`\`

## 🗄️ Schema do Banco de Dados

\`\`\`prisma
enum PetType {
  DOG
  CAT
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  pets         Pet[]
}

model Pet {
  id          String   @id @default(cuid())
  name        String
  type        PetType
  age         Int
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}
\`\`\`

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ instalado
- PostgreSQL instalado e rodando

### Passo a passo

1. **Clone o repositório** (se aplicável)
\`\`\`bash
git clone <url-do-repositorio>
cd desafio-jr-rian
\`\`\`

2. **Instale as dependências**
\`\`\`bash
npm install
\`\`\`

3. **Configure o banco de dados**

Edite o arquivo \`.env\` com suas credenciais PostgreSQL:
\`\`\`env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
JWT_SECRET="sua-chave-secreta-super-segura-mude-em-producao"
\`\`\`

4. **Execute as migrations do Prisma**
\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

5. **Inicie o servidor de desenvolvimento**
\`\`\`bash
npm run dev
\`\`\`

6. **Acesse no navegador**
\`\`\`
http://localhost:3000
\`\`\`

## 🔐 Segurança Implementada

- ✅ **Senhas hasheadas** com bcrypt (salt rounds: 10)
- ✅ **JWT em cookie httpOnly** (não acessível via JavaScript)
- ✅ **Cookie com SameSite=lax** e Secure em produção
- ✅ **Validação de dados** no backend com Zod
- ✅ **Autorização granular** - verificação de propriedade antes de editar/deletar
- ✅ **Middleware de autenticação** protegendo rotas privadas
- ✅ **Cascade delete** - pets são deletados quando usuário é deletado

## 📡 API Endpoints

### Autenticação
- \`POST /api/auth/register\` - Registrar novo usuário
- \`POST /api/auth/login\` - Fazer login
- \`POST /api/auth/logout\` - Fazer logout
- \`GET /api/auth/me\` - Obter usuário atual

### Pets
- \`GET /api/pets\` - Listar pets do usuário (requer autenticação)
- \`POST /api/pets\` - Criar novo pet (requer autenticação)
- \`GET /api/pets/[id]\` - Obter pet específico (requer autenticação + propriedade)
- \`PUT /api/pets/[id]\` - Atualizar pet (requer autenticação + propriedade)
- \`DELETE /api/pets/[id]\` - Deletar pet (requer autenticação + propriedade)

### Respostas de Autorização
- **401 Unauthorized** - Usuário não autenticado
- **403 Forbidden** - Usuário autenticado mas sem permissão (tentou editar/deletar pet de outro usuário)
- **404 Not Found** - Recurso não encontrado

## 🎨 Páginas

- **\`/\`** - Landing page com apresentação
- **\`/register\`** - Registro de novo usuário
- **\`/login\`** - Login
- **\`/dashboard\`** - Dashboard protegido com CRUD de pets

## 🧪 Testando o Sistema

### 1. Criar um usuário
1. Acesse \`http://localhost:3000\`
2. Clique em "Criar Conta"
3. Preencha email e senha (mínimo 6 caracteres)
4. Você será redirecionado para o dashboard

### 2. Adicionar pets
1. No dashboard, clique em "Adicionar Pet"
2. Preencha nome, tipo, idade e descrição
3. Clique em "Criar Pet"

### 3. Editar/Deletar pets
- Clique em "Editar" para modificar um pet
- Clique em "Deletar" para remover (com confirmação)

### 4. Testar controle de acesso
Para testar a regra de 403:
1. Crie dois usuários diferentes
2. Crie pets com cada usuário
3. Tente usar a API diretamente para editar um pet de outro usuário (retornará 403)

## 🚫 O que NÃO foi usado

- ❌ Edge Runtime (tudo roda em Node.js padrão)
- ❌ Prisma Accelerate
- ❌ Adapters de autenticação externos
- ❌ Bibliotecas de autenticação prontas (NextAuth, etc.)

## 📝 Notas Importantes

- Tokens JWT expiram em **7 dias**
- Cookies são **httpOnly** e **secure em produção**
- Middleware protege rotas \`/dashboard/*\` e \`/pets/*\`
- Prisma Client é gerado em \`app/generated/prisma\`
- Em desenvolvimento, o Prisma Client é mantido em cache para evitar múltiplas instâncias

## 🛡️ Validações

### Registro/Login
- Email deve ser válido
- Senha deve ter no mínimo 6 caracteres
- Email único (não pode duplicar)

### Pets
- Nome é obrigatório
- Tipo deve ser exatamente "DOG" ou "CAT"
- Idade deve ser número inteiro ≥ 0
- Descrição é opcional

## 🔄 Fluxo de Autenticação

1. Usuário faz registro/login
2. Backend valida dados com Zod
3. No login: verifica senha com bcrypt.compare()
4. Cria token JWT com { userId, email }
5. Seta cookie httpOnly com o token
6. Middleware verifica o cookie em rotas protegidas
7. APIs verificam autenticação e autorização

## 📦 Comandos Úteis

\`\`\`bash
# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção
npm start

# Prisma Studio (interface visual do banco)
npx prisma studio

# Gerar Prisma Client após mudanças no schema
npx prisma generate

# Criar nova migration
npx prisma migrate dev --name nome_da_migration
\`\`\`

## 🎯 Requisitos Atendidos

✅ Autenticação com email e senha  
✅ Zod para validação  
✅ bcrypt para hash de senhas  
✅ JWT em cookie httpOnly  
✅ Middleware de proteção de rotas  
✅ CRUD completo de pets com Prisma  
✅ Controle de acesso no backend (403 para tentativas não autorizadas)  
✅ Interface com Tailwind  
✅ React Hook Form  
✅ Tudo em Node.js padrão  
✅ PostgreSQL local (sem Accelerate)  
✅ API Routes do Next.js  

---

Desenvolvido como desafio para vaga de Desenvolvedor Fullstack Jr 🚀
