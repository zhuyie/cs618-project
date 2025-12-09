import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Recipe } from './pages/Recipe.jsx'
import { RecipeDetail } from './pages/RecipeDetail.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
import { AuthContextProvider, useAuth } from './contexts/AuthContext.jsx'
import { jwtDecode } from 'jwt-decode'
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

// Component to handle notifications with auth filtering
function NotificationListener() {
  const [token] = useAuth()
  const userId = token ? jwtDecode(token).sub : null

  useEffect(() => {
    const listener = (data) => {
      if (data.author && data.author.toString() === userId) return // skip if creator

      console.log('new recipe notification for', data.title)
      toast(
        <div>
          <strong>New recipe:</strong> {data.title}
          <br />
          <button
            onClick={() => {
              toast.dismiss()
              navigate(`/recipe/${data.id}`)
            }}
          >
            View Recipe
          </button>
        </div>,
        { autoClose: 5000 }
      )
    }

    socket.on('recipe.new', listener)
    return () => socket.off('recipe.new', listener)
  }, [userId])

  return null
}

socket.on('connect', () => {
  console.log('connected to socket.io as', socket.id)
})
socket.on('connect_error', (err) => {
  console.error('socket.io connect error:', err)
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
        <NotificationListener />
        <ToastContainer />
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
