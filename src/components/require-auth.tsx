/** Route guard — redirects to SSO login if user not authenticated. */

import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/use-auth'

interface Props {
  children: React.ReactNode
  /** If true, also require admin role */
  admin?: boolean
}

export default function RequireAuth({ children, admin }: Props) {
  const { user, loading, checkAuth } = useAuth()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    checkAuth().then(() => setChecked(true))
  }, [checkAuth])

  if (!checked || loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>
  }

  if (!user) {
    // Redirect to CAS SSO login
    window.location.href = '/api/auth/login'
    return null
  }

  if (admin && !user.is_admin) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Access denied — admin only.</div>
  }

  return <>{children}</>
}
