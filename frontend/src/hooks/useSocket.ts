import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../hooks/useAuth'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function useSocket() {
  const { token } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<
    { id: string; content: string; user?: { name: string } }[]
  >([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!token) return

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/messages?page=1&limit=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const data = await response.json()
        if (Array.isArray(data.messages)) {
          setMessages(data.messages)
          setTotalPages(data.totalPages)
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error)
      }
    }

    fetchMessages()
  }, [token])

  useEffect(() => {
    if (!token) return

    const newSocket = io(SOCKET_URL, {
      auth: { token }
    })
    setSocket(newSocket)

    newSocket.on('newMessage', message => {
      setMessages(prevMessages => {
        if (!prevMessages.some(msg => msg.id === message.id)) {
          return [...prevMessages, message]
        }
        return prevMessages
      })
    })

    return () => {
      newSocket.disconnect()
    }
  }, [token])

  const sendMessage = async (content: string) => {
    if (!token || !content.trim()) return

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      })

      if (response.ok) {
        const newMessage = await response.json()

        if (socket) {
          socket.emit('sendMessage', newMessage)
        }

        setMessages(prevMessages => {
          if (!prevMessages.some(msg => msg.id === newMessage.id)) {
            return [...prevMessages, newMessage]
          }
          return prevMessages
        })
      } else {
        console.error('Erro ao enviar mensagem:', await response.json())
      }
    } catch (error) {
      console.error('Erro na requisição de envio de mensagem:', error)
    }
  }

  const loadMessages = async (newPage: number) => {
    if (!token || newPage > totalPages) return

    try {
      const response = await fetch(
        `${API_URL}/messages?page=${newPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()
      if (Array.isArray(data.messages)) {
        setMessages(prevMessages => {
          const newMessages = data.messages.filter(
            (msg: { id: string; content: string; user?: { name: string } }) =>
              !prevMessages.some(existing => existing.id === msg.id)
          )
          return [...newMessages, ...prevMessages]
        })
        setTotalPages(data.totalPages)
        setPage(newPage)
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    }
  }

  return { messages, sendMessage, loadMessages, page, totalPages }
}
