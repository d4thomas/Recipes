import { Outlet } from 'react-router-dom'
import { RecipeNotification } from './RecipeNotification.jsx'

export function Layout() {
  return (
    <>
      <RecipeNotification />
      <Outlet />
    </>
  )
}
