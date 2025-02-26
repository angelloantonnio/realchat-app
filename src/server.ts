import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import routes from './routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})