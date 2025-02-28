import { useEffect } from 'react'
import Chat from '../components/Chat'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { token, isLoading } = useAuth()

  useEffect(() => {
    if (!token && !isLoading) {
      window.location.href = '/login'
    }
  }, [token, isLoading])

  if (isLoading) return <p>Carregando...</p>

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <Chat />
    </div>
  )
}
