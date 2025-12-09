import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Recipe } from './pages/Recipe.jsx'
import { RecipeDetail } from './pages/RecipeDetail.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const socket = io(import.meta.env.VITE_SOCKET_HOST)
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <Recipe />,
  },
  {
    path: '/recipe/:id',
    element: <RecipeDetail />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
])

socket.on('connect', () => {
  console.log('connected to socket.io as', socket.id)
})
socket.on('connect_error', (err) => {
  console.error('socket.io connect error:', err)
})
socket.on('recipe.new', (data) => {
  toast(<div>
    <strong>New recipe:</strong> {data.title}
    <br />
    <Link to={`/recipe/${data.id}`}>View Recipe</Link>
  </div>)
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
