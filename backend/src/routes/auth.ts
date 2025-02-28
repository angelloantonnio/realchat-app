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
    return
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    res.status(500).json({ error: 'Erro ao registrar usuário' })
    return
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

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ error: 'Credenciais inválidas' })
      return
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: TOKEN_EXPIRATION
    })

    res.json({ message: 'Login bem-sucedido!', token })
    return
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ error: 'Erro no login' })
    return
  }
})

router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido' })
    return
  }

  revokedTokens.add(token)
  res.json({ message: 'Logout realizado com sucesso' })
  return
})

export function checkTokenRevoked(token: string): boolean {
  return revokedTokens.has(token)
}

export default router
