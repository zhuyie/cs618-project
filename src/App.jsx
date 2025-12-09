import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Recipe } from './pages/Recipe.jsx'
import { RecipeDetail } from './pages/RecipeDetail.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Outlet,
} from 'react-router-dom'
import { io } from 'socket.io-client'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'
import { setNavigate, navigate } from './navigationRef.js'

const socket = io(import.meta.env.VITE_SOCKET_HOST)
const queryClient = new QueryClient()

// Component to expose navigate globally
function NavigationRefSetter() {
  const navigate = useNavigate()
  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])
  return null
}

const router = createBrowserRouter([
  {
    element: (
      <>
        <NavigationRefSetter />
        <Outlet />
      </>
    ),
    children: [
      { path: '/', element: <Recipe /> },
      { path: '/recipe/:id', element: <RecipeDetail /> },
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
    ],
  },
])

socket.on('connect', () => {
  console.log('connected to socket.io as', socket.id)
})
socket.on('connect_error', (err) => {
  console.error('socket.io connect error:', err)
})
socket.on('recipe.new', (data) => {
  console.log('new recipe created')
  toast(
    <div>
      <strong>New recipe:</strong> {data.title}
      <br />
      <button onClick={() => navigate(`/recipe/${data.id}`)}>
        View Recipe
      </button>
    </div>,
    { autoClose: 5000 },
  )
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
