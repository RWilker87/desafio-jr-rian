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
* Node.js 18+
* PostgreSQL rodando localmente ou em container Docker

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/RWilker87/desafio-jr-rian.git
    cd desafio-jr-rian
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    No arquivo .env
    ```env
    DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
    JWT_SECRET="sua-chave-secreta-super-segura"
    ```

4.  **Execute as Migrations:**
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Inicie o Servidor:**
    ```bash
    npm run dev
    ```

6.  **Acesse:** `http://localhost:3000`

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