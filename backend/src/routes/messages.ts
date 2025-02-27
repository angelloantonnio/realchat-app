import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { Server } from 'socket.io'
import { authenticateToken } from '../middlewares/auth'

const router = Router()
const prisma = new PrismaClient()

export default (io: Server) => {
  router.post('/', authenticateToken, async (req, res) => {
    try {
      const { content } = req.body
      const userId = (req as any).user.userId

      if (!content.trim()) {
        res.status(400).json({ error: 'Conteúdo é obrigatório' })
        return
      }

      const message = await prisma.message.create({
        data: { content, userId },
        include: { user: true }
      })

      const safeMessage = {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        user: message.user
          ? {
              id: message.user.id,
              name: message.user.name,
              email: message.user.email
            }
          : null
      }

      io.emit('newMessage', message)

      res.status(201).json(safeMessage)
    } catch (error) {
      console.error('Erro ao criar mensagem:', error)
      res.status(500).json({ error: 'Erro ao criar mensagem' })
    }
  })

  router.get('/', authenticateToken, async (req, res) => {
    try {
      let { page, limit } = req.query

      const pageNumber = parseInt(page as string) || 1
      const limitNumber = parseInt(limit as string) || 10
      const skip = (pageNumber - 1) * limitNumber

      const messages = await prisma.message.findMany({
        skip,
        take: limitNumber,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      })

      const totalMessages = await prisma.message.count()
      const totalPages = Math.ceil(totalMessages / limitNumber)

      const safeMessages = messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        createdAt: msg.createdAt,
        user: msg.user
          ? {
              id: msg.user.id,
              name: msg.user.name,
              email: msg.user.email
            }
          : null
      }))

      res.json({
        page: pageNumber,
        totalPages,
        limit: limitNumber,
        totalMessages,
        messages: safeMessages
      })
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      res.status(500).json({ error: 'Erro ao buscar mensagens' })
    }
  })

  return router
}
