/** Auth context — lazy auth that only fetches user when needed. */

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { get, BASE_URL } from '../services/api-client'

interface User {
  id: number
  name: string
  email: string
  department: string
  role: string | null
  country: string
  is_admin: boolean
}

interface AuthState {
  user: User | null
  loading: boolean
  /** Fetch current user from server. Pass force=true to bypass cache. */
  checkAuth: (force?: boolean) => Promise<User | null>
  logout: () => void
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: false,
  checkAuth: async () => null,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const checked = useRef(false)

  const checkAuth = useCallback(async (force = false): Promise<User | null> => {
    // If already checked and not forced, return cached user
    if (checked.current && !force) return user

    setLoading(true)
    try {
      const u = await get<User>('/auth/me')
      setUser(u)
      checked.current = true
      return u
    } catch {
      setUser(null)
      checked.current = true
      return null
    } finally {
      setLoading(false)
    }
  }, [user])

  const logout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      setUser(null)
      checked.current = false
      // Backend returns Keycloak logout URL for SSO signout
      if (data.logout_url) {
        window.location.href = data.logout_url
        return
      }
    } catch {
      setUser(null)
      checked.current = false
    }
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
