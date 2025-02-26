import { Router } from 'express'
import prisma from '../config/prisma'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body
    if (!name || !email)
      res.status(400).json({ error: 'Nome e email são obrigatórios' })

    const user = await prisma.user.create({
      data: { name, email }
    })

    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' })
  }
})

router.get('/', async (_req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' })
  }
})

export default router