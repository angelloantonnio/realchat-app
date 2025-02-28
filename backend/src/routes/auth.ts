import bcrypt from 'bcryptjs'
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma'

const router = Router()
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key'
const TOKEN_EXPIRATION = '1h'

const revokedTokens = new Set<string>()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Nome, email e senha são obrigatórios' })
      return
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      res.status(400).json({ error: 'Email já está em uso' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })

    res
      .status(201)
      .json({ message: 'Usuário cadastrado com sucesso!', userId: user.id })
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    res.status(500).json({ error: 'Erro ao registrar usuário' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email e senha são obrigatórios' })
      return
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      res.status(400).json({ error: 'Usuário não encontrado' })
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      res.status(400).json({ error: 'Senha inválida' })
      return
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: TOKEN_EXPIRATION
    })

    res.json({ message: 'Login bem-sucedido!', token })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ error: 'Erro no login' })
  }
})

router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido' })
    return
  }

  revokedTokens.add(token)
  res.json({ message: 'Logout realizado com sucesso' })
})

export function checkTokenRevoked(token: string) {
  return revokedTokens.has(token)
}

export default router
