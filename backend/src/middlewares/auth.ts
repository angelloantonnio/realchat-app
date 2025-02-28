import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { checkTokenRevoked } from '../routes/auth'

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key'

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido' })
    return
  }

  if (checkTokenRevoked(token)) {
    res.status(403).json({ error: 'Token revogado. Faça login novamente' })
    return
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      res.status(403).json({ error: 'Token inválido' })
      return
    }
    ;(req as any).user = user
    next()
  })
}
