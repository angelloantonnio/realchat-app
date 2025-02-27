import { Router } from 'express'
import prisma from '../config/prisma'
import { authenticateToken } from '../middlewares/auth'

const router = Router()

router.get('/', authenticateToken, async (_req, res) => {
  try {
    const users = await prisma.user.findMany()
    const safeUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email
    }))
    res.json(safeUsers)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' })
  }
})

export default router
