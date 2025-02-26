import { Router } from 'express'
import prisma from '../config/prisma'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { content, userId } = req.body
    if (!content || !userId)
      res.status(400).json({ error: 'Conteúdo e userId são obrigatórios' })

    const message = await prisma.message.create({
      data: { content, userId }
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

export default router
