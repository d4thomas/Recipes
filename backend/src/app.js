import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import { recipesRoutes } from './routes/recipes.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(bodyParser.json())
recipesRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

export { app }
