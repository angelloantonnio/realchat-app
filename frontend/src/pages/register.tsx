import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const registered = await register(name, email, password)
    if (registered) {
      setSuccess(true)
      setError('')
    } else {
      setError('Erro ao registrar. Tente novamente.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">Cadastro</h2>
      {success && (
        <p className="text-green-500">
          Cadastro realizado com sucesso!{' '}
          <a href="/login" className="underline">
            Faça login
          </a>
        </p>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleRegister} className="flex flex-col gap-3 w-80">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white outline-none"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white outline-none"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white outline-none"
          required
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 rounded-md text-white font-bold"
        >
          Cadastrar
        </button>
      </form>
      <p className="mt-4">
        Já tem uma conta?{' '}
        <a href="/login" className="text-blue-400 underline">
          Faça login
        </a>
      </p>
    </div>
  )
}
