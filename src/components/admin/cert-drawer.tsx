/** Slide-in cert review drawer with approve/reject/revoke actions. */

import { useTranslation } from 'react-i18next'
import styles from '../../pages/admin-page.module.css'
import type { UserRow } from './data-table'

interface Props {
  user: UserRow | null
  onClose: () => void
  onApprove: (id: number) => void
  onReject: (id: number) => void
}

export default function CertDrawer({ user, onClose, onApprove, onReject }: Props) {
  const { t } = useTranslation()
  const isOpen = user !== null
  const isPending = user?.status === 'pending'
  const isDone = user?.status === 'done'

  const checks = user && user.status !== 'missing'
    ? [
        { ok: true, label: `${t('check_format').replace('...', '')} (PDF)` },
        { ok: true, label: `${t('cert_issuer_label')}: Google LLC / Coursera` },
        { ok: true, label: `${t('cert_learner')}: ${user.name}` },
        { ok: !!user.course, label: `${t('cert_course_label')}: ${user.course || '—'}` },
        { ok: !!user.submitted_at, label: `${t('cert_date_label')}: ${user.submitted_at?.slice(0, 10) || '—'}` },
      ]
    : []

  return (
    <div className={`${styles.certDrawer}${isOpen ? ` ${styles.open}` : ''}`}>
      <div className={styles.drawerHdr}>
        <h3>🔍 {t('drawer_title')}</h3>
        <button className={styles.drawerClose} onClick={onClose}>✕</button>
      </div>

      <div className={styles.drawerBody}>
        {user && (
          <>
            {/* User info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg,var(--red),var(--red-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 800, flexShrink: 0, color: '#fff',
              }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{user.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>{user.email}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{user.department} · {user.country}</div>
              </div>
            </div>

            {user.status !== 'missing' ? (
              <>
                {/* Cert preview */}
                <div className="cert-preview-box" style={{ marginBottom: 18, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', background: '#f4f6f9', position: 'relative' }}>
                  <div style={{
                    background: 'linear-gradient(135deg,#2a1e12,#0f0e0c)',
                    padding: '28px 24px', textAlign: 'center', position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', top: 14, right: 14, width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, background: isDone ? 'rgba(0,201,122,0.15)' : 'rgba(250,195,10,0.12)', border: `2px solid ${isDone ? 'rgba(0,201,122,0.4)' : 'rgba(250,195,10,0.35)'}` }}>
                      {isDone ? '✅' : '⏳'}
                    </div>
                    <div style={{ fontSize: 48, marginBottom: 10 }}>🎓</div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red-light)', marginBottom: 6 }}>Certificate of Completion</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{user.course}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-light)' }}>Awarded to: {user.name}</div>
                  </div>
                </div>

                {/* Metadata grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                  {[
                    { label: t('cert_course_label'), val: user.course, cls: 'ok' },
                    { label: 'Submitted', val: user.submitted_at?.slice(0, 10) || '—', cls: '' },
                    { label: t('cert_issuer_label'), val: 'Google LLC', cls: 'ok' },
                    { label: t('th_status'), val: isDone ? 'Verified' : 'Pending', cls: isDone ? 'ok' : 'warn' },
                  ].map((m) => (
                    <div key={m.label} style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace', color: m.cls === 'ok' ? 'var(--green)' : m.cls === 'warn' ? 'var(--orange)' : undefined }}>{m.val}</div>
                    </div>
                  ))}
                </div>

                {/* Verification checks */}
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Verification checks</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  {checks.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: c.ok ? 'rgba(0,201,122,0.07)' : 'rgba(240,90,34,0.07)', fontSize: 12 }}>
                      <span style={{ fontSize: 14, minWidth: 18, textAlign: 'center' }}>{c.ok ? '✅' : '❌'}</span>
                      <span>{c.label}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)' }}>No certificate submitted</div>
                <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 6 }}>This employee has not submitted a certificate yet.</div>
              </div>
            )}

            {/* Prior reject note */}
            {user.reject_note && (
              <div style={{ background: 'rgba(240,90,34,0.07)', border: '1px solid rgba(240,90,34,0.2)', borderRadius: 8, padding: 12, marginTop: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--red-light)', marginBottom: 4 }}>PREVIOUS REJECT REASON</div>
                <div style={{ fontSize: 12, color: 'var(--muted-light)' }}>{user.reject_note}</div>
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.drawerFooter}>
        {isPending && (
          <>
            <button className="btn-danger" style={{ flex: 1, padding: '9px 0', fontSize: 12, borderRadius: 8, justifyContent: 'center' }} onClick={() => user && onReject(user.id)}>
              {t('drawer_btn_reject')}
            </button>
            <button className="btn-primary" style={{ flex: 1, padding: '9px 0', fontSize: 12, borderRadius: 8, justifyContent: 'center' }} onClick={() => user && onApprove(user.id)}>
              {t('drawer_btn_approve')}
            </button>
          </>
        )}
        {isDone && (
          <>
            <button className="btn-ghost" style={{ flex: 1, padding: '9px 0', fontSize: 12, borderRadius: 8, justifyContent: 'center' }} onClick={() => user && onReject(user.id)}>
              ↩ Revoke
            </button>
            <button className="btn-secondary sm" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
              {t('drawer_btn_close')}
            </button>
          </>
        )}
        {!isPending && !isDone && (
          <button className="btn-secondary sm" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
            {t('drawer_btn_close')}
          </button>
        )}
      </div>
    </div>
  )
}
