/** Admin sidebar with section groups and active state. */

import { useTranslation } from 'react-i18next'
import styles from '../../pages/admin-page.module.css'

export type AdminPanel = 'dashboard' | 'staff' | 'submissions' | 'log'

interface Props {
  active: AdminPanel
  onPanel: (p: AdminPanel) => void
}

export default function AdminSidebar({ active, onPanel }: Props) {
  const { t } = useTranslation()

  const item = (panel: AdminPanel, icon: string, label: string) => (
    <button
      className={`${styles.sbItem} ${active === panel ? styles.active : ''}`}
      onClick={() => onPanel(panel)}
    >
      <span className={styles.sbIcon}>{icon}</span>
      {label}
    </button>
  )

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sbSection}>
        <span className={styles.sbSectionLabel}>{t('sb_dashboard')}</span>
        {item('dashboard', '📊', t('sb_overview'))}
      </div>

      <div className={styles.sbDivider} />

      <div className={styles.sbSection}>
        <span className={styles.sbSectionLabel}>{t('sb_manage')}</span>
        {item('staff', '👥', t('sb_staff'))}
        {item('submissions', '📋', t('sb_submissions'))}
        {item('log', '📜', t('sb_log'))}
      </div>

    </aside>
  )
}
