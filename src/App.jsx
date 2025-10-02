import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecipeManager } from './pages/RecipeManager.jsx'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RecipeManager />
    </QueryClientProvider>
  )
}
