import { useState } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState<{ id: number; text: string }[]>([])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return

    setMessages([...messages, { id: Date.now(), text: input }])
    setInput('')
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border border-gray-700 rounded-md">
      
      {/* Área das mensagens */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900 text-white">
        {messages.length > 0 ? (
          messages.map(msg => (
            <div key={msg.id} className="mb-2 p-2 bg-gray-800 rounded-lg">
              {msg.text}
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
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}