import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export default function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<{ id: string; content: string }[]>(
    []
  )

  useEffect(() => {
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)

    newSocket.on('newMessage', message => {
      setMessages(prevMessages => [...prevMessages, message])
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const sendMessage = (message: string) => {
    if (socket && message.trim()) {
      socket.emit('sendMessage', {
        content: message,
        userId: 'ID_FIXO_DO_USUARIO'
      })
    }
  }

  return { messages, sendMessage }
}
