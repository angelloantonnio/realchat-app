import { Router } from 'express'
import { Server } from 'socket.io'
import prisma from '../config/prisma'

const router = Router()

export default (io: Server) => {
  router.post('/', async (req, res) => {
    try {
      const { content, userId } = req.body

      if (!content.trim()) {
        res.status(400).json({ error: 'Conteúdo é obrigatório' })
      }

      const message = await prisma.message.create({
        data: {
          content,
          userId: userId || null
        },
        include: { user: true }
      })
      
      res.status(201).json(message)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar mensagem' })
    }
  })

  router.get('/', async (_req, res) => {
    try {
      const messages = await prisma.message.findMany({
        include: { user: true }
      })
      res.json(messages)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar mensagens' })
    }
  })

  return router
}
