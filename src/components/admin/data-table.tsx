/** Dashboard data table with checkbox selection, shift+click multi-select. */

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styles from '../../pages/admin-page.module.css'
import { STATUS_BADGE, STATUS_KEY } from '../../constants'

export interface UserRow {
  id: number
  name: string
  email: string
  employee_id?: string | null
  department: string
  direct_boss?: string | null
  country: string
  course: string
  submitted_at: string | null
  status: 'done' | 'pending' | 'missing'
  reject_note?: string
  submission_id?: number | null
}

interface Props {
  rows: UserRow[]
  selected: Set<number>
  onSelect: (ids: Set<number>) => void
  onReview: (id: number) => void
  onSingleEmail: (id: number) => void
  total: number
}


export default function DataTable({ rows: rawRows, selected, onSelect, onReview, onSingleEmail, total }: Props) {
  const rows = rawRows ?? []
  const { t } = useTranslation()
  const lastClickedRef = useRef<number | null>(null)

  const toggleAll = (checked: boolean) => {
    const next = new Set(checked ? rows.map((r) => r.id) : [])
    onSelect(next)
  }

  const toggleRow = (id: number, checked: boolean, shiftKey: boolean) => {
    const next = new Set(selected)
    if (shiftKey && lastClickedRef.current != null) {
      const ids = rows.map((r) => r.id)
      const a = ids.indexOf(lastClickedRef.current)
      const b = ids.indexOf(id)
      const [lo, hi] = [Math.min(a, b), Math.max(a, b)]
      ids.slice(lo, hi + 1).forEach((i) => next.add(i))
    } else {
      if (checked) next.add(id)
      else next.delete(id)
    }
    lastClickedRef.current = id
    onSelect(next)
  }

  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id))

  return (
    <div className={styles.dtblWrap}>
      <table>
        <thead>
          <tr>
            <th className="th-check">
              <input
                type="checkbox"
                className="row-check"
                checked={allChecked}
                onChange={(e) => toggleAll(e.target.checked)}
              />
            </th>
            <th>{t('th_staff')}</th>
            <th>{t('th_dept')}</th>
            <th>{t('th_country')}</th>
            <th>{t('th_course')}</th>
            <th>{t('th_date')}</th>
            <th>{t('th_status')}</th>
            <th>{t('th_actions')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={selected.has(row.id) ? 'selected' : ''} id={`row-${row.id}`}>
              <td>
                <input
                  type="checkbox"
                  className="row-check"
                  checked={selected.has(row.id)}
                  onChange={(e) => toggleRow(row.id, e.target.checked, false)}
                  onClick={(e) => toggleRow(row.id, (e.target as HTMLInputElement).checked, e.shiftKey)}
                />
              </td>
              <td>
                <div className="tdn">{row.name}</div>
                <div className="tdm">{row.email}</div>
              </td>
              <td style={{ color: 'var(--muted-light)', fontSize: 12 }}>{row.department}</td>
              <td style={{ fontSize: 11, color: 'var(--muted)' }}>{row.country}</td>
              <td style={{ fontSize: 11, color: 'var(--muted)' }}>{row.course || '—'}</td>
              <td className="tdm">{row.submitted_at ? row.submitted_at.slice(0, 10) : '—'}</td>
              <td>
                <span className={STATUS_BADGE[row.status]}>
                  {t(STATUS_KEY[row.status])}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: 4 }}>
                  {row.status !== 'missing' && (
                    <button className="btn-ghost" onClick={() => onReview(row.id)}>
                      {row.status === 'pending' ? `🔍 ${t('action_review')}` : `👁 ${t('action_view')}`}
                    </button>
                  )}
                  {row.status === 'missing' && (
                    <button className="btn-ghost" onClick={() => onSingleEmail(row.id)}>📧 {t('btn_send_email')}</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.tblFooter}>
        <span>Showing {rows.length} / {total}</span>
        {selected.size > 0 && (
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Shift+click to select range</span>
        )}
      </div>
    </div>
  )
}
