/** Floating bar shown when rows are selected — bulk verify/email/reject actions. */

import { useTranslation } from 'react-i18next'
import styles from '../../pages/admin-page.module.css'

interface Props {
  count: number
  onVerify: () => void
  onEmail: () => void
  onReject: () => void
  onDeselect: () => void
}

export default function BulkActionBar({ count, onVerify, onEmail, onReject, onDeselect }: Props) {
  const { t } = useTranslation()

  if (count === 0) return null

  return (
    <div className={`${styles.bulkBar} ${styles.show}`}>
      <span className={styles.bulkCount}>{count} selected</span>
      <div className={styles.bulkSep} />
      <span style={{ fontSize: 12, color: 'var(--muted)' }}>Bulk actions:</span>
      <div className={styles.bulkActions}>
        <button className="btn-ghost" onClick={onVerify}>✓ {t('bulk_verify')}</button>
        <button className="btn-ghost" onClick={onEmail}>📧 {t('bulk_email')}</button>
        <button className="btn-danger" onClick={onReject}>✕ {t('bulk_reject')}</button>
      </div>
      <button className="adv-clear" onClick={onDeselect} style={{ marginLeft: 'auto' }}>
        {t('btn_deselect')}
      </button>
    </div>
  )
}
