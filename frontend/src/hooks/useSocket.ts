import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<{ id: string; content: string }[]>(
    []
  )
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)

    newSocket.on('newMessage', message => {
      setMessages(prevMessages => [message, ...prevMessages])
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const loadMessages = async (pageNumber: number) => {
    try {
      const response = await fetch(
        `${API_URL}/messages?page=${pageNumber}&limit=10`
      )
      const data = await response.json()

      setMessages(prevMessages => [...prevMessages, ...data.messages])
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    }
  }

  const sendMessage = (message: string) => {
    if (socket && message.trim()) {
      socket.emit('sendMessage', {
        content: message,
        userId: 'ID_FIXO_DO_USUARIO'
      })
    }
  }

  return { messages, sendMessage, loadMessages, page, setPage, totalPages }
}
