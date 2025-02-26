import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Servidor está rodando!' })
})

export default router
