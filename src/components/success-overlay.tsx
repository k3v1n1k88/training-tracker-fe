/** Full-screen success overlay shown after certificate submission. */

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styles from './success-overlay.module.css'

interface SuccessOverlayProps {
  email: string
  visible: boolean
}

export default function SuccessOverlay({ email, visible }: SuccessOverlayProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (!visible) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.emoji}>🎉</div>
      <div className={styles.title}>{t('sov_title')}</div>
      <div className={styles.sub}>
        {t('sov_sub') ?? 'Certificate recorded. Confirmation email sent to'}{' '}
        <strong>{email}</strong>.
      </div>
      <button
        className="btn-primary"
        onClick={() => navigate('/')}
      >
        {t('btn_go_home')}
      </button>
    </div>
  )
}
