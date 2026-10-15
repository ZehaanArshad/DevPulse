import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import LinkPlatform from './pages/LinkPlatform'
import Platform from './pages/Platform'
import ProtectedRoute from './components/ProtectedRoute'


function App() {
  return (
    <Routes>
      <Route
        // path="/"
        // element={
        //   <ProtectedRoute>
        //     <Dashboard />
        //   </ProtectedRoute>
        // }
      />
      <Route path="/" element={<Dashboard />} />
      <Route path="/platform/:name" element={<Platform />} />
      


      <Route path="/link-platform" element={<LinkPlatform />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
