import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken, setUserId, clearToken } from '../api/auth'
import { getMe } from '../api/api'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    async function finishLogin() {
      const params = new URLSearchParams(window.location.hash.slice(1))
      const token = params.get('token')

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      setToken(token)

      try {
        const me = await getMe()
        setUserId(me.id)
        navigate('/', { replace: true })
      } catch {
        clearToken()
        navigate('/login', { replace: true })
      }
    }

    finishLogin()
  }, [])

  return <p>Signing you in...</p>
}

export default AuthCallback
