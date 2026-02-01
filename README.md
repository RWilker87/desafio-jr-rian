# 🐾 Pet Manager - Desafio Fullstack Jr

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)

Sistema fullstack completo para gerenciamento de pets, desenvolvido com **Next.js 16 (App Router)**, **PostgreSQL**, **Prisma** e autenticação **JWT** manual segura.

---

## 🚀 Tecnologias Utilizadas

### Backend
* **Next.js 16** (App Router) com API Routes em Node.js
* **PostgreSQL** - Banco de dados relacional robusto
* **Prisma 7** - ORM moderno para TypeScript
* **bcryptjs** - Hash seguro de senhas
* **jsonwebtoken** - Implementação de autenticação via token
* **Zod** - Validação rigorosa de schemas e tipos

### Frontend
* **React 19** com TypeScript
* **Tailwind CSS 4** - Estilização utilitária e responsiva
* **React Hook Form** - Gerenciamento otimizado de formulários
* **@hookform/resolvers** - Integração perfeita entre Zod e React Hook Form

---

## ✨ Funcionalidades

### 🔐 Autenticação & Segurança
- [x] **Registro de Usuários:** Cadastro com email e senha (validação Zod).
- [x] **Login Seguro:** Validação de credenciais e geração de JWT.
- [x] **Logout:** Remoção segura dos cookies.
- [x] **Proteção de Dados:** Senhas hasheadas com `bcrypt` (10 rounds).
- [x] **Cookie httpOnly:** JWT armazenado em cookie inacessível via JavaScript (prevenção XSS).
- [x] **Middleware:** Proteção automática de rotas privadas no Next.js.

### 🐶 CRUD de Pets
- [x] **Criar Pets:** Cadastro com nome, tipo (DOG/CAT), idade e descrição.
- [x] **Listagem:** Visualização de todos os pets vinculados ao usuário logado.
- [x] **Edição & Remoção:** Funcionalidades completas de update e delete.
- [x] **Controle de Acesso (ACL):** O usuário só pode editar/deletar seus **próprios** pets. Tentativas de acesso a recursos alheios retornam `403 Forbidden`.
- [x] **Relacionamento:** Modelagem One-to-Many (User → Pets).

### 🎨 Interface (UI/UX)
- [x] Design moderno e responsivo com **Tailwind CSS**.
- [x] Validação de formulários em tempo real com feedback visual.
- [x] Estados de carregamento (Loading states) para melhor UX.

---

## 📁 Estrutura do Projeto

```bash
desafio-jr-rian/
├── app/
│   ├── api/                 # Backend API Routes
│   │   ├── auth/            # Endpoints de Autenticação (Login, Register, Logout, Me)
│   │   └── pets/            # Endpoints de CRUD de Pets (GET, POST, PUT, DELETE)
│   ├── components/          # Componentes Reutilizáveis (Ex: PetForm)
│   ├── dashboard/           # Área Privada (CRUD de Pets)
│   ├── login/               # Página de Login
│   ├── register/            # Página de Registro
│   └── ...                  # Layouts e Configurações Globais
├── lib/                     # Utilitários e Configurações
│   ├── auth.ts              # Helpers de Autenticação
│   ├── jwt.ts               # Manipulação de Tokens
│   ├── prisma.ts            # Instância Singleton do Prisma
│   └── validations/         # Schemas Zod (Auth e Pet)
├── prisma/                  # Schema do Banco de Dados e Migrations
├── middleware.ts            # Proteção de Rotas (Edge/Node)
└── ...
```

---

## 🗄️ Modelagem de Dados (Prisma)

```prisma
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
```

---

## 🛠️ Instalação e Execução

### Pré-requisitos
* **Node.js 18+** - [Download](https://nodejs.org/)
* **Docker e Docker Compose** - [Download](https://www.docker.com/products/docker-desktop/) (recomendado)
* **Git** - [Download](https://git-scm.com/)

---

### 🚀 Quick Start (com Docker - Recomendado)

A forma mais rápida de rodar o projeto é usando Docker para o banco de dados:

```bash
# 1. Clone o repositório
git clone https://github.com/RWilker87/desafio-jr-rian.git
cd desafio-jr-rian

# 2. Copie o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Suba o banco de dados PostgreSQL com Docker
docker-compose up -d

# 4. Instale as dependências
npm install

# 5. Execute as migrations do banco de dados
npx prisma migrate dev

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

✅ **Pronto!** Acesse: [http://localhost:3000](http://localhost:3000)

---

### 📋 Configuração Detalhada

#### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/RWilker87/desafio-jr-rian.git
cd desafio-jr-rian
```

#### 2️⃣ Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (ou copie o `.env.example`):

```bash
cp .env.example .env
```

**Conteúdo do `.env`:**

```env
# Conexão com o PostgreSQL (Docker padrão)
DATABASE_URL="postgresql://postgres:admin@localhost:5432/desafio_jr_rian?schema=public"

# Chave secreta para JWT (TROQUE EM PRODUÇÃO!)
JWT_SECRET="troque-por-uma-chave-segura"
```

> ⚠️ **Importante:** Em produção, use uma chave JWT forte e segura!

#### 3️⃣ Configure o Banco de Dados

**Opção A: Usando Docker (Recomendado)**

O projeto inclui um `docker-compose.yml` que configura automaticamente o PostgreSQL:

```bash
# Subir o container do PostgreSQL
docker-compose up -d

# Verificar se está rodando
docker ps
```

| Configuração | Valor |
|-------------|-------|
| Host | `localhost` |
| Porta | `5432` |
| Usuário | `postgres` |
| Senha | `admin` |
| Banco | `desafio_jr_rian` |

**Comandos úteis do Docker:**

```bash
# Parar o container
docker-compose down

# Ver logs do container
docker-compose logs -f

# Parar e remover volumes (⚠️ apaga dados)
docker-compose down -v
```

**Opção B: PostgreSQL Local**

Se preferir usar uma instalação local do PostgreSQL:

1. Instale o PostgreSQL na sua máquina
2. Crie um banco de dados chamado `desafio_jr_rian`
3. Atualize a `DATABASE_URL` no `.env` com suas credenciais

#### 4️⃣ Instale as Dependências

```bash
npm install
```

#### 5️⃣ Execute as Migrations

```bash
# Criar/atualizar as tabelas no banco de dados
npx prisma migrate dev

# (Opcional) Gerar o Prisma Client
npx prisma generate
```

#### 6️⃣ Inicie o Servidor

```bash
npm run dev
```

#### 7️⃣ Acesse a Aplicação

Abra seu navegador em: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoints

| Método | Endpoint | Descrição | Auth? |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registrar novo usuário | ❌ |
| `POST` | `/api/auth/login` | Realizar login | ❌ |
| `POST` | `/api/auth/logout` | Realizar logout | ✅ |
| `GET` | `/api/auth/me` | Dados do usuário logado | ✅ |
| `GET` | `/api/pets` | Listar pets do usuário | ✅ |
| `POST` | `/api/pets` | Criar novo pet | ✅ |
| `GET` | `/api/pets/[id]` | Detalhes de um pet | ✅ |
| `PUT` | `/api/pets/[id]` | Atualizar pet | ✅ |
| `DELETE` | `/api/pets/[id]` | Remover pet | ✅ |

---

## 🛡️ Decisões Técnicas e Segurança

* **Autenticação Manual:** Optei por não usar bibliotecas como NextAuth para demonstrar conhecimento profundo do fluxo de autenticação (Hash, JWT, Cookies).
* **Cookies httpOnly:** O token JWT não é armazenado em `localStorage`, prevenindo ataques XSS. Em produção, os cookies também recebem a flag `Secure`.
* **Validação Dupla:** Os dados são validados no Frontend (para UX) e no Backend (para segurança) usando **Zod**.
* **Autorização Granular:** O backend verifica não apenas se o usuário está logado, mas se o recurso que ele tenta alterar **pertence** a ele.
* **Node.js Runtime:** Todo o projeto roda no ambiente Node.js padrão, sem uso de Edge Runtime, garantindo compatibilidade total com o ecossistema.

---

---

## 🧪 Testes Automatizados

### Configuração

O projeto utiliza **Vitest** para testes de integração com banco de dados real (PostgreSQL via Docker).

**Dependências:**
- `vitest` - Framework de testes rápido e moderno
- `@vitejs/plugin-react` - Plugin para React
- `happy-dom` - Ambiente DOM leve

### Executar Testes

```bash
# Subir banco de dados (necessário para testes de integração)
docker-compose up -d

# Rodar migrations
npx prisma migrate dev

# Executar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Com interface visual
npm run test:ui
```

### Testes Implementados

#### ✅ Teste de Integração - Login (`tests/integration/auth.test.ts`)

Valida o fluxo completo de autenticação:

1. **Login com credenciais válidas**
   - Cria usuário de teste no banco real
   - Envia POST /api/auth/login
   - Verifica status 200
   - Valida presença do cookie `auth_token`
   - Valida flags de segurança (HttpOnly, SameSite)
   - Valida estrutura da resposta JSON

2. **Login com credenciais inválidas**
   - Testa senha incorreta
   - Verifica status 401 Unauthorized

3. **Validação de dados**
   - Testa email malformado
   - Verifica status 400 Bad Request

---

## 🧪 Como Testar Manualmente

1.  **Registro:** Crie uma conta em `/register`. A senha exige min. 6 caracteres.
2.  **Dashboard:** Adicione alguns pets.
3.  **Segurança:** Tente acessar `/dashboard` em uma aba anônima (deve redirecionar para login).
4.  **Teste de ACL:** Se possível, crie dois usuários. Tente usar o ID do pet do Usuário A para fazer uma requisição de DELETE logado como Usuário B (retornará 403).

---

## 📦 Comandos Úteis

```bash
# Rodar Prisma Studio (Interface visual do banco)
npx prisma studio

# Gerar tipagens do Prisma após alterar schema
npx prisma generate

# Rodar testes
npm test
```

---

<p align="center">
  Desenvolvido por Rian como desafio técnico Fullstack Jr 🚀
</p>