import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import LinkPlatform from './pages/LinkPlatform'
import Platform from './pages/Platform'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import AuthCallback from './pages/AuthCallback'


function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* <Route path="/" element={<Dashboard />} /> */}
      <Route
      path="/platform/:name"
      element={
      <ProtectedRoute>
        <Platform />
        </ProtectedRoute>
      }
      />
      


      <Route
        path="/link-platform"
        element={
          <ProtectedRoute>
            <LinkPlatform />
          </ProtectedRoute>
        }
      />


      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route path="/auth/callback" element={<AuthCallback />} />

    </Routes>
  )
}

export default App
