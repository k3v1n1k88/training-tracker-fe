/** Submissions panel — filterable table of submitted certificates. */

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { get } from '../../services/api-client'
import { useToast } from '../../hooks/use-toast'
import styles from '../../pages/admin-page.module.css'
import Spinner from '../ui/spinner'
import EmptyState from '../ui/empty-state'
import { COURSES } from '../../constants'

interface Submission {
  id: number
  user_name: string
  user_email: string
  course: string
  file_name: string | null
  submitted_at: string
  status: 'done' | 'pending'
}


export default function SubmissionsPanel() {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [subs, setSubs] = useState<Submission[]>([])
  const [course, setCourse] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (course) params.set('course', course)
    if (status) params.set('status', status)
    get<{ items: Submission[] }>(`/submissions?${params}`)
      .then((res) => setSubs(res.items ?? []))
      .catch(err => showToast(err?.message || 'Failed to load submissions', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [course, status])

  return (
    <div>
      <div className={styles.adminHdr}>
        <div>
          <h2>{t('subs_title')}</h2>
          <div className={styles.adminHdrSub}>{t('subs_sub')}</div>
        </div>
        <div className={styles.adminHdrActions}>
          <select className="adv-select" value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">All courses</option>
            {COURSES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="adv-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="done">Verified</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className={styles.tblOuter} style={{ paddingTop: 0 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <Spinner size={32} />
          </div>
        ) : subs.length === 0 ? (
          <EmptyState message="No submissions found" />
        ) : (
          <div className={styles.dtblWrap}>
            <table>
              <thead>
                <tr>
                  <th>{t('th_staff')}</th>
                  <th>{t('th_course')}</th>
                  <th>File</th>
                  <th>{t('th_date')}</th>
                  <th>{t('th_status')}</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="tdn">{s.user_name}</div>
                      <div className="tdm">{s.user_email}</div>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--muted-light)' }}>{s.course}</td>
                    <td className="tdm">{s.file_name || '—'}</td>
                    <td className="tdm">{s.submitted_at ? s.submitted_at.slice(0, 10) : '—'}</td>
                    <td>
                      <span className={s.status === 'done' ? 'badge badge-green' : 'badge badge-orange'}>
                        {s.status === 'done' ? `${t('badge_done')} ✓` : t('badge_pending')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.tblFooter}>
              <span>{subs.length} submissions</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
