import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/use-auth'
import { ToastProvider } from './hooks/use-toast'
import Navbar from './components/navbar'
import RequireAuth from './components/require-auth'
import AuthCallbackPage from './pages/auth-callback-page'
import LandingPage from './pages/landing-page'
import SubmitPage from './pages/submit-page'
import AdminPage from './pages/admin-page'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Navbar />
        <div style={{ paddingTop: 64, minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/submit" element={
              <RequireAuth>
                <SubmitPage />
              </RequireAuth>
            } />
            <Route path="/admin/*" element={
              <RequireAuth admin>
                <AdminPage />
              </RequireAuth>
            } />
          </Routes>
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}
