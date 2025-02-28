import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import useSocket from '../hooks/useSocket'

export default function Chat() {
  const { messages, sendMessage, loadMessages, page, totalPages } = useSocket()
  const { logout } = useAuth()
  const [input, setInput] = useState('')

  useEffect(() => {
    loadMessages(1)
  }, [])

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1
      loadMessages(nextPage)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border border-gray-700 rounded-md">
      {/* Header do Chat */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h2 className="text-xl font-bold">Chat</h2>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Sair
        </button>
      </div>

      {/* Botão de Carregar Mais Mensagens */}
      {page < totalPages && (
        <button
          onClick={handleLoadMore}
          className="p-2 bg-blue-600 text-white text-sm rounded-md self-center my-2"
        >
          Carregar mais mensagens
        </button>
      )}

      {/* Área de Mensagens */}
      <div
        id="chat-container"
        className="flex-1 overflow-y-auto p-4 bg-gray-900 text-white"
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={msg.id || `message-${index}`}
              className="mb-2 p-2 bg-gray-800 rounded-lg"
            >
              <p className="font-bold">{msg.user?.name || 'Anônimo'}:</p>
              {msg.content}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">Nenhuma mensagem ainda.</p>
        )}
      </div>

      {/* Campo de Entrada */}
      <div className="p-4 bg-gray-800 flex">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 p-2 text-black rounded-md outline-none"
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
