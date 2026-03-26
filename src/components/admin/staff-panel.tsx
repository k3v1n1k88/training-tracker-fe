/** Staff management panel — table with search, add/edit/delete employee actions. */

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { get, del } from '../../services/api-client'
import { useToast } from '../../hooks/use-toast'
import styles from '../../pages/admin-page.module.css'
import UserModal from './user-modal'
import Spinner from '../ui/spinner'
import EmptyState from '../ui/empty-state'
import { STATUS_BADGE, STATUS_KEY } from '../../constants'

interface StaffUser {
  id: number
  name: string
  email: string
  department: string
  role: string | null
  country: string
  joined_at: string | null
  status: 'done' | 'pending' | 'missing'
}


export default function StaffPanel() {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [users, setUsers] = useState<StaffUser[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; user?: Partial<{ id: number; name: string; email: string; department: string; role: string; country: string }> } | null>(null)

  const load = () => {
    setLoading(true)
    get<{ items: StaffUser[] }>('/users')
      .then((res) => setUsers(res.items ?? []))
      .catch(err => showToast(err?.message || 'Failed to load staff', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = users.filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q)
  })

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete ${name}?`)) return
    try {
      await del(`/users/${id}`)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      showToast('User deleted', 'success')
    } catch (e: unknown) {
      const err = e as { message?: string }
      showToast(err?.message || 'Delete failed', 'error')
    }
  }

  const handleSaved = () => { setModal(null); load() }

  return (
    <div>
      <div className={styles.adminHdr}>
        <div>
          <h2>{t('users_title')}</h2>
          <div className={styles.adminHdrSub}>{t('users_sub')}</div>
        </div>
        <div className={styles.adminHdrActions}>
          <input
            className="sbox"
            placeholder={`🔍 ${t('th_staff')}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 170 }}
          />
          <button className="btn-primary sm" onClick={() => setModal({ mode: 'add' })}>
            ＋ {t('btn_add_staff')}
          </button>
        </div>
      </div>

      <div className={styles.tblOuter} style={{ paddingTop: 0 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <Spinner size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState message="No staff found" />
        ) : (
          <div className={styles.dtblWrap}>
            <table>
              <thead>
                <tr>
                  <th>{t('th_staff')}</th>
                  <th>{t('th_dept')}</th>
                  <th>{t('th_role')}</th>
                  <th>{t('th_country')}</th>
                  <th>{t('th_joined')}</th>
                  <th>{t('th_status')}</th>
                  <th style={{ minWidth: 120 }}>{t('th_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="tdn">{u.name}</div>
                      <div className="tdm">{u.email}</div>
                    </td>
                    <td style={{ color: 'var(--muted-light)', fontSize: 12 }}>{u.department}</td>
                    <td style={{ fontSize: 11, color: 'var(--muted)' }}>{u.role || '—'}</td>
                    <td style={{ fontSize: 11, color: 'var(--muted)' }}>{u.country}</td>
                    <td className="tdm">{u.joined_at ? u.joined_at.slice(0, 10) : '—'}</td>
                    <td><span className={STATUS_BADGE[u.status]}>{t(STATUS_KEY[u.status])}</span></td>
                    <td style={{ display: 'flex', gap: 4, flexWrap: 'wrap', padding: '8px 14px' }}>
                      <button className="btn-ghost" onClick={() => setModal({ mode: 'edit', user: { ...u, role: u.role ?? undefined } })}>✏️</button>
                      <button className="btn-danger" onClick={() => handleDelete(u.id, u.name)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.tblFooter}>
              <span>{filtered.length} / {users.length} {t('sb_staff').replace('👥 ', '')}</span>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <UserModal
          mode={modal.mode}
          initial={modal.user}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
