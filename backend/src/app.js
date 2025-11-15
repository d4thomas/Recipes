import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { recipesRoutes } from './routes/recipes.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import { typeDefs, resolvers } from './graphql/index.js'
import { optionalAuth } from './middleware/jwt.js'
import { handleSocket } from './socket.js'

dotenv.config()

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

const app = express()
app.use(cors())
app.use(bodyParser.json())
recipesRoutes(app)
userRoutes(app)
eventRoutes(app)

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
handleSocket(io)

apolloServer.start().then(() =>
  app.use(
    '/graphql',
    optionalAuth,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        return { auth: req.auth, io }
      },
    }),
  ),
)

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

export { server as app, io }
