import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(email, password)
    if (!success) {
      setError('Email ou senha inválidos.')
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-80">
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
          Entrar
        </button>
      </form>
      <p className="mt-4">
        Ainda não tem conta?{' '}
        <a href="/register" className="text-blue-400 underline">
          Cadastre-se
        </a>
      </p>
    </div>
  )
}
