import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import { configureSocket } from './config/socket'
import authRoutes from './routes/auth'
import messageRoutes from './routes/messages'
import userRoutes from './routes/users'

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = configureSocket(server)

const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/messages', messageRoutes(io))

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
