import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../api/auth'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1))
    const token = params.get('token')

    if (token) {
      setToken(token)
      navigate('/', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [])

  return <p>Signing you in...</p>
}

export default AuthCallback

