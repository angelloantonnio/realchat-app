import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import messageRoutes from './routes/messages'
import userRoutes from './routes/users'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/messages', messageRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
