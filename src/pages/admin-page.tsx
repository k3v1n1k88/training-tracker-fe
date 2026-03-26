/** Admin dashboard page — sidebar + panel switching + all sub-panels. */

import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { get, post, downloadBlob } from '../services/api-client'
import { useToast } from '../hooks/use-toast'
import styles from './admin-page.module.css'

import Spinner from '../components/ui/spinner'
import AdminSidebar, { type AdminPanel } from '../components/admin/admin-sidebar'
import KpiCardGrid from '../components/admin/kpi-card-grid'
import ProgressBar from '../components/admin/progress-bar'
import FilterBar, { type Filters, type StatusFilter } from '../components/admin/filter-bar'
import DataTable, { type UserRow } from '../components/admin/data-table'
import BulkActionBar from '../components/admin/bulk-action-bar'
import CertDrawer from '../components/admin/cert-drawer'
import StaffPanel from '../components/admin/staff-panel'
import SubmissionsPanel from '../components/admin/submissions-panel'
import ActivityLogPanel from '../components/admin/activity-log-panel'
import EmailReminderModal from '../components/admin/email-reminder-modal'
import RejectModal from '../components/admin/reject-modal'

/** Maps to backend DashboardStats schema */
interface Stats {
  total: number
  approved: number
  pending: number
  missing: number
  rejected: number
  completion_pct: number
}

const DEFAULT_FILTERS: Filters = {
  status: 'all' as StatusFilter,
  search: '',
  dept: '',
  course: '',
  country: '',
  from: '',
  to: '',
}

export default function AdminPage() {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [panel, setPanel] = useState<AdminPanel>('dashboard')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [rows, setRows] = useState<UserRow[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [drawerUser, setDrawerUser] = useState<UserRow | null>(null)
  const [emailModal, setEmailModal] = useState<{ open: boolean; targetUser?: { id: number; name: string; email: string } }>({ open: false })
  const [rejectIds, setRejectIds] = useState<number[]>([])

  // Load stats
  const loadStats = useCallback(() => {
    get<Stats>('/dashboard/stats').then(setStats).catch(err => showToast(err?.message || 'Failed to load stats', 'error'))
  }, [showToast])

  // Load dashboard table rows with current filters
  const loadRows = useCallback(() => {
    setLoading(true)
    const p = new URLSearchParams()
    if (filters.status !== 'all') p.set('status', filters.status)
    if (filters.search) p.set('search', filters.search)
    if (filters.dept) p.set('dept', filters.dept)
    if (filters.course) p.set('course', filters.course)
    if (filters.country) p.set('country', filters.country)
    if (filters.from) p.set('from', filters.from)
    if (filters.to) p.set('to', filters.to)
    get<{ items: UserRow[]; total: number }>(`/users?${p}`)
      .then((res) => { setRows(res.items ?? []); setTotalRows(res.total ?? 0) })
      .catch(err => showToast(err?.message || 'Failed to load users', 'error'))
      .finally(() => setLoading(false))
  }, [filters, showToast])

  useEffect(() => {
    loadStats()
    loadRows()
  }, [loadStats, loadRows])

  const handlePanel = (p: AdminPanel) => {
    setPanel(p)
    setDrawerUser(null)
    setSelected(new Set())
    if (p === 'dashboard') { loadStats(); loadRows() }
  }

  const handleExport = () => {
    downloadBlob('/admin/export-excel', 'training-report.xlsx').catch(err => showToast(err?.message || 'Export failed', 'error'))
  }

  // Bulk verify — map user IDs to submission IDs
  const handleBulkVerify = async () => {
    const subIds = [...selected]
      .map((id) => rows.find((r) => r.id === id && r.status === 'pending')?.submission_id)
      .filter((sid): sid is number => !!sid)
    if (!subIds.length) return
    try {
      await post('/admin/approve', { ids: subIds })
      setSelected(new Set())
      loadStats()
      loadRows()
      showToast(`${subIds.length} submission${subIds.length > 1 ? 's' : ''} approved`, 'success')
    } catch (e: unknown) {
      const err = e as { message?: string }
      showToast(err?.message || 'Bulk approve failed', 'error')
    }
  }

  // Bulk reject — open modal with submission IDs
  const handleBulkReject = () => {
    const subIds = [...selected]
      .map((id) => rows.find((r) => r.id === id && r.status === 'pending')?.submission_id)
      .filter((sid): sid is number => !!sid)
    if (!subIds.length) return
    setRejectIds(subIds)
  }

  // Approve from drawer — map user ID to submission ID
  const handleApprove = async (userId: number) => {
    const subId = rows.find((r) => r.id === userId)?.submission_id
    if (!subId) { showToast('No active submission found', 'error'); return }
    try {
      await post('/admin/approve', { ids: [subId] })
      setDrawerUser(null)
      loadStats()
      loadRows()
      showToast('Submission approved', 'success')
    } catch (e: unknown) {
      const err = e as { message?: string }
      showToast(err?.message || 'Approve failed', 'error')
    }
  }

  // Reject from drawer — map user ID to submission ID
  const handleDrawerReject = (userId: number) => {
    const subId = rows.find((r) => r.id === userId)?.submission_id
    if (!subId) { showToast('No active submission found', 'error'); return }
    setRejectIds([subId])
    setDrawerUser(null)
  }

  const handleRejected = () => {
    setRejectIds([])
    setSelected(new Set())
    setDrawerUser(null)
    loadStats()
    loadRows()
  }

  const handleSingleEmail = (id: number) => {
    const user = rows.find((r) => r.id === id)
    if (!user) return
    setEmailModal({ open: true, targetUser: { id: user.id, name: user.name, email: user.email } })
  }

  const rejectNames = rejectIds
    .map((sid) => rows.find((r) => r.submission_id === sid)?.name ?? String(sid))
    .join(', ')

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar
        active={panel}
        onPanel={handlePanel}
      />

      <main className={styles.content}>
        {/* Dashboard panel */}
        {panel === 'dashboard' && (
          <div>
            <div className={styles.adminHdr}>
              <div>
                <h2>Dashboard</h2>
                <div className={styles.adminHdrSub}>
                  {t('dash_updated', { defaultValue: `Updated: ${new Date().toLocaleString()}` })}
                </div>
              </div>
              <div className={styles.adminHdrActions}>
                <button className="btn-secondary sm" onClick={() => setEmailModal({ open: true })}>
                  📧 {t('btn_send_reminder')}
                </button>
                <button className="btn-primary sm" onClick={handleExport}>
                  📥 {t('btn_export_excel')}
                </button>
              </div>
            </div>

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <Spinner size={32} />
              </div>
            )}

            <KpiCardGrid stats={stats} />

            <ProgressBar
              pct={stats?.completion_pct ?? 0}
              done={stats?.approved ?? 0}
              pending={stats?.pending ?? 0}
              missing={stats?.missing ?? 0}
            />

            <div className={styles.tblOuter} style={{ paddingTop: 14 }}>
              <FilterBar
                filters={filters}
                onChange={(f) => { setFilters(f); setSelected(new Set()) }}
                onClear={() => { setFilters(DEFAULT_FILTERS); setSelected(new Set()) }}
              />
              <BulkActionBar
                count={selected.size}
                onVerify={handleBulkVerify}
                onEmail={() => setEmailModal({ open: true })}
                onReject={handleBulkReject}
                onDeselect={() => setSelected(new Set())}
              />
              <DataTable
                rows={rows}
                selected={selected}
                onSelect={setSelected}
                onReview={(id) => setDrawerUser(rows.find((r) => r.id === id) ?? null)}
                onSingleEmail={handleSingleEmail}
                total={totalRows}
              />
            </div>
          </div>
        )}

        {panel === 'staff' && <StaffPanel />}
        {panel === 'submissions' && <SubmissionsPanel />}
        {panel === 'log' && <ActivityLogPanel />}
      </main>

      {/* Cert drawer — always rendered, slides in when user set */}
      <CertDrawer
        user={drawerUser}
        onClose={() => setDrawerUser(null)}
        onApprove={handleApprove}
        onReject={handleDrawerReject}
      />

      {/* Email reminder modal */}
      {emailModal.open && (
        <EmailReminderModal
          targetUser={emailModal.targetUser}
          missingCount={stats?.missing ?? 0}
          onClose={() => setEmailModal({ open: false })}
          onSent={() => { loadStats(); loadRows() }}
        />
      )}

      {/* Reject modal */}
      {rejectIds.length > 0 && (
        <RejectModal
          ids={rejectIds}
          names={rejectNames}
          onClose={() => setRejectIds([])}
          onRejected={handleRejected}
        />
      )}
    </div>
  )
}
