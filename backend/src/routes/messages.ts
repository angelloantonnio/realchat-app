import { Router } from 'express'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client';

const router = Router()
const prisma = new PrismaClient()

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

      io.emit('newMessage', message)

      res.status(201).json(message)
    } catch (error) {
      console.error("Erro ao criar mensagem:", error);
      res.status(500).json({ error: 'Erro ao criar mensagem' })
    }
  })

  router.get('/', async (req, res) => {
    try {
      let { page, limit } = req.query;

      const pageNumber = parseInt(page as string) || 1;
      const limitNumber = parseInt(limit as string) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      const messages = await prisma.message.findMany({
        skip,
        take: limitNumber,
        orderBy: { createdAt: "desc" },
        include: { user: true }
      });

      const totalMessages = await prisma.message.count();
      const totalPages = Math.ceil(totalMessages / limitNumber);

      res.json({
        page: pageNumber,
        totalPages,
        limit: limitNumber,
        totalMessages,
        messages
      });
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      res.status(500).json({ error: 'Erro ao buscar mensagens' })
    }
  })

  return router
}
