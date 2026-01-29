import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          🐾 Pet Manager
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Gerencie seus pets de forma simples e organizada
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition shadow-lg hover:shadow-xl"
          >
            Fazer Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 bg-white hover:bg-gray-50 text-indigo-600 border-2 border-indigo-600 rounded-xl font-semibold transition shadow-lg hover:shadow-xl"
          >
            Criar Conta
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="font-bold text-gray-800 mb-2">Seguro</h3>
            <p className="text-gray-600 text-sm">
              Autenticação com JWT e senhas criptografadas
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-800 mb-2">Rápido</h3>
            <p className="text-gray-600 text-sm">
              Criado com Next.js e PostgreSQL para máxima performance
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-bold text-gray-800 mb-2">Simples</h3>
            <p className="text-gray-600 text-sm">
              Interface intuitiva para gerenciar seus pets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
