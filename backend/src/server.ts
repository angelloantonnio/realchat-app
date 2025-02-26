import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import messageRoutes from './routes/messages'
import userRoutes from './routes/users'

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/messages', messageRoutes(io))

io.on('connection', socket => {
  console.log(`Usuário conectado: ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`)
  })
})

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
