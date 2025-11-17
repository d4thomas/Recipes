import jwt from 'jsonwebtoken'

export function handleSocket(io) {
  io.on('connection', (socket) => {
    const token = socket.handshake.auth.token
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        socket.userId = decoded.sub
        console.log('Client connected:', socket.id, 'User:', socket.userId)
      } catch (err) {
        console.log('Invalid token for socket:', socket.id)
      }
    } else {
      console.log('Client connected (unauthenticated):', socket.id)
    }

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })
}
