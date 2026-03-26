/** Modal dialog shown on landing page after auth failure. */

import { useTranslation } from 'react-i18next'
import BaseModal from './ui/base-modal'
import { BASE_URL } from '../services/api-client'

const ERROR_KEYS: Record<string, string> = {
  auth_failed: 'auth_error_failed',
  unauthorized_domain: 'auth_error_domain',
}

interface Props {
  error: string
  onDismiss: () => void
}

export default function AuthErrorDialog({ error, onDismiss }: Props) {
  const { t } = useTranslation()
  const messageKey = ERROR_KEYS[error] || 'auth_error_generic'

  return (
    <BaseModal
      title={t('auth_error_title')}
      onClose={onDismiss}
      maxWidth={420}
      footer={
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <a className="btn-ghost" href={`${BASE_URL}/auth/login`} style={{ textDecoration: 'none' }}>{t('btn_try_again')}</a>
          <button className="btn-primary" onClick={onDismiss}>{t('btn_close')}</button>
        </div>
      }
    >
      <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, margin: '8px 0 0' }}>
        {t(messageKey)}
      </p>
    </BaseModal>
  )
}
