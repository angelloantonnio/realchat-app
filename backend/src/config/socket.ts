import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'
import prisma from '../config/prisma'

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key'

export function configureSocket(server: any) {
  const io = new Server(server, {
    cors: { origin: '*' }
  })

  io.on('connection', async socket => {
    console.log(`Usuário conectado: ${socket.id}`)

    socket.on('authenticate', async token => {
      try {
        const decoded = jwt.verify(token, SECRET_KEY) as { userId: string }
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId }
        })

        if (!user) {
          return socket.disconnect()
        }

        ;(socket as any).userId = user.id
        console.log(`Usuário autenticado: ${user.id}`)
      } catch (error) {
        console.error('Erro na autenticação do WebSocket:', error)
        socket.disconnect()
      }
    })

    socket.on('sendMessage', async data => {
      const { content } = data
      const userId = (socket as any).userId

      if (!content.trim() || !userId) return

      const message = await prisma.message.create({
        data: { content, userId },
        include: { user: true }
      })

      io.emit('newMessage', message)
    })

    socket.on('disconnect', () => {
      console.log(`Usuário desconectado: ${socket.id}`)
    })
  })

  return io
}
