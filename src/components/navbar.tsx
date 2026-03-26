/** Top navigation bar with tabs, language selector, and profile dropdown. */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/use-auth'
import { BASE_URL } from '../services/api-client'
import logoSrc from '../assets/logo-vnggames.png'
import styles from './navbar.module.css'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'vi', label: 'VI' },
  { code: 'ko', label: 'KO' },
  { code: 'zh', label: 'ZH' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, checkAuth, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  // Fetch user on mount so navbar shows profile on all pages (including public)
  useEffect(() => { checkAuth() }, [checkAuth])
  const [showLang, setShowLang] = useState(false)

  const initials = user
    ? (user.name[0] + (user.name[1] || '')).toUpperCase()
    : '??'

  const switchLang = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('tt_lang', code)
    setShowLang(false)
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.brand} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src={logoSrc} alt="VNG Games" className={styles.logo} />
        <div className={styles.brandDivider} />
        <div>
          <div className={styles.title}>Training Tracker</div>
          <div className={styles.subtitle}>{t('nav_sub')}</div>
        </div>
      </div>

      <div className={styles.right}>
        {/* Language dropdown */}
        <div className={styles.langWrap}>
          <button className={styles.langBtn} onClick={() => setShowLang(!showLang)}>
            🌐 {i18n.language.toUpperCase()}
          </button>
          {showLang && (
            <div className={styles.langMenu}>
              {LANGUAGES.map(l => (
                <button key={l.code} className={styles.langItem} onClick={() => switchLang(l.code)}>
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile or Login */}
        {user ? (
          <div className={styles.profileWrap}>
            <button className={styles.profileBtn} onClick={() => setShowProfile(!showProfile)}>
              <div className={styles.avatar}>{initials}</div>
              <span className={styles.email}>{user.email}</span>
              <span className={styles.caret}>▾</span>
            </button>
            {showProfile && (
              <div className={styles.profileMenu}>
                <div className={styles.profileInfo}>
                  <div className={styles.profileName}>{user.name}</div>
                  <div className={styles.profileEmail}>{user.email}</div>
                </div>
                {user.is_admin && (
                  <button
                    className={styles.menuItem}
                    onClick={() => { navigate('/admin'); setShowProfile(false) }}
                  >
                    {t('nav_admin')}
                  </button>
                )}
                <button className={styles.logoutBtn} onClick={logout}>
                  ↪ {t('sign_out')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <a href={`${BASE_URL}/auth/login`} className={styles.loginBtn}>
            Sign in
          </a>
        )}
      </div>
    </nav>
  )
}
