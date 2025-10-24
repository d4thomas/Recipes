import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import { recipesRoutes } from './routes/recipes.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(bodyParser.json())
recipesRoutes(app)
userRoutes(app)
eventRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

export { app }
