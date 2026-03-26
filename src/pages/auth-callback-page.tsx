/** Auth callback page — verifies login success, updates auth state, redirects. */

import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'

export default function AuthCallbackPage() {
  const { checkAuth } = useAuth()
  const navigate = useNavigate()
  const ran = useRef(false)

  useEffect(() => {
    // Guard against StrictMode double-run
    if (ran.current) return
    ran.current = true

    checkAuth(true).then((user) => {
      if (user) {
        navigate('/', { replace: true })
      } else {
        alert('Login failed — please try again.')
        navigate('/', { replace: true })
      }
    })
  }, [checkAuth, navigate])

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      Signing in...
    </div>
  )
}
