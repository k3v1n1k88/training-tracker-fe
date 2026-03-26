/** Reject/revoke modal — reason textarea + notify checkbox + confirm. */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { post } from '../../services/api-client'
import { useToast } from '../../hooks/use-toast'
import BaseModal from '../ui/base-modal'

interface Props {
  ids: number[]
  names: string
  onClose: () => void
  onRejected: () => void
}

export default function RejectModal({ ids, names, onClose, onRejected }: Props) {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [reason, setReason] = useState('')
  const [notify, setNotify] = useState(true)
  const [reasonError, setReasonError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setReasonError(true)
      return
    }
    setSubmitting(true)
    try {
      await post('/admin/reject', { ids, reason, notify })
      showToast(`${ids.length > 1 ? `${ids.length} submissions` : 'Submission'} rejected`, 'success')
      onRejected()
      onClose()
    } catch (e: unknown) {
      const err = e as { message?: string }
      showToast(err?.message || 'Reject failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const subtitle = ids.length === 1
    ? `Rejecting certificate for: ${names}`
    : `Rejecting ${ids.length} certificates: ${names}`

  const footer = (
    <>
      <button className="btn-secondary sm" onClick={onClose}>{t('btn_cancel')}</button>
      <button
        className="btn-danger"
        style={{ padding: '7px 16px', fontSize: 12, borderRadius: 8 }}
        onClick={handleConfirm}
        disabled={submitting}
      >
        {submitting ? 'Rejecting…' : `✕ ${t('btn_confirm_reject')}`}
      </button>
    </>
  )

  return (
    <BaseModal
      title={`✕ ${t('reject_title')}`}
      subtitle={subtitle}
      onClose={onClose}
      footer={footer}
      maxWidth={420}
    >
      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--muted-light)', marginBottom: 6 }}>
          {t('reject_reason_label')} <span style={{ color: 'var(--red)' }}>*</span>
        </label>
        <textarea
          rows={4}
          style={{
            width: '100%',
            background: '#f9fafb',
            border: `1px solid ${reasonError ? 'var(--red)' : 'rgba(0,0,0,0.12)'}`,
            borderRadius: 8,
            padding: '9px 12px',
            fontSize: 12,
            color: '#111827',
            fontFamily: 'inherit',
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
          placeholder="e.g. Certificate does not match the required course, name does not match profile..."
          value={reason}
          onChange={(e) => { setReason(e.target.value); setReasonError(false) }}
        />
      </div>

      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          id="reject-notify"
          checked={notify}
          onChange={(e) => setNotify(e.target.checked)}
          style={{ accentColor: 'var(--red)', width: 14, height: 14 }}
        />
        <label htmlFor="reject-notify" style={{ fontSize: 12, color: 'var(--muted-light)', cursor: 'pointer' }}>
          Send email notification to employee
        </label>
      </div>
    </BaseModal>
  )
}
