import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSocket } from '../contexts/SocketIOContext.jsx'

export function RecipeNotification() {
  const { socket } = useSocket()
  const [notification, setNotification] = useState(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!socket) return

    const newRecipe = (recipe) => setNotification(recipe)
    socket.on('recipe.new', newRecipe)
    return () => {
      socket.off('recipe.new', newRecipe)
    }
  }, [socket])

  if (!isClient || !notification) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '15px',
        right: '15px',
        backgroundColor: 'white',
        border: '2px solid black',
        padding: '10px',
      }}
    >
      <div>
        <strong>New Recipe Added!</strong>
      </div>
      <br />
      <div>
        <Link
          to={`/recipes/${notification.id}`}
          onClick={() => setNotification(null)}
        >
          View Recipe
        </Link>
      </div>
      <br />
      <button onClick={() => setNotification(null)}>Dismiss</button>
    </div>
  )
}
