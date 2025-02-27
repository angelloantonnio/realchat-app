import { useEffect, useState } from 'react'
import useSocket from '../hooks/useSocket'

export default function Chat() {
  const { messages, sendMessage, loadMessages, page, setPage, totalPages } =
    useSocket()
  const [input, setInput] = useState('')

  useEffect(() => {
    loadMessages(1)
  }, [])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(page + 1)
      loadMessages(page + 1)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border border-gray-700 rounded-md">
      {/* Botão de carregar mais mensagens */}
      {page < totalPages && (
        <button
          onClick={handleLoadMore}
          className="p-2 bg-blue-600 text-white text-sm rounded-md self-center my-2"
        >
          Carregar mais mensagens
        </button>
      )}

      {/* Área das mensagens */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900 text-white">
        {messages.length > 0 ? (
          messages.map(msg => (
            <div key={msg.id} className="mb-2 p-2 bg-gray-800 rounded-lg">
              {msg.content}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">Nenhuma mensagem ainda.</p>
        )}
      </div>

      {/* Campo de entrada */}
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
