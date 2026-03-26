/** Activity log panel — chronological list of admin actions with colored dots. */

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { get } from '../../services/api-client'
import { useToast } from '../../hooks/use-toast'
import styles from '../../pages/admin-page.module.css'
import Spinner from '../ui/spinner'

interface LogEntry {
  id: number
  type: 'green' | 'red' | 'orange' | 'blue'
  message: string
  created_at: string
}

export default function ActivityLogPanel() {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    get<{ items: LogEntry[] }>('/activity-logs')
      .then((res) => setEntries((res.items ?? []).slice(0, 100)))
      .catch(err => showToast(err?.message || 'Failed to load activity log', 'error'))
      .finally(() => setLoading(false))
  }, [showToast])

  return (
    <div>
      <div className={styles.adminHdr}>
        <div>
          <h2>{t('log_title')}</h2>
          <div className={styles.adminHdrSub}>{t('log_sub')}</div>
        </div>
      </div>

      <div className={styles.tblOuter} style={{ paddingTop: 0 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <Spinner size={32} />
          </div>
        ) : (
          <div className={styles.dtblWrap} style={{ padding: '0 4px' }}>
            <div className={styles.activityLog}>
              {entries.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
                  No activity yet.
                </div>
              )}
              {entries.map((e) => (
                <div key={e.id} className={styles.actItem}>
                  <div className={`${styles.actDot} ${styles[e.type]}`} />
                  <div className={styles.actBody}>
                    <div style={{ fontSize: 13 }}>{e.message}</div>
                    <div className={styles.actTime}>
                      {new Date(e.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
