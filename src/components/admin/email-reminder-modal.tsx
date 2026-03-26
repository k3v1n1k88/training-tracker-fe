/** Email reminder modal — send bulk or single email with subject/body preview. */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { post } from '../../services/api-client'
import { useToast } from '../../hooks/use-toast'
import BaseModal from '../ui/base-modal'

interface TargetUser {
  id: number
  name: string
  email: string
}

interface Props {
  /** If set, single-user mode. Otherwise bulk mode for all missing employees. */
  targetUser?: TargetUser
  missingCount?: number
  onClose: () => void
  onSent: () => void
}

const DEFAULT_SUBJECT = '[Reminder] Complete your Google course before 30/04/2026'
const DEFAULT_BODY = `Dear Team,

This is a reminder about the mandatory training program. Please complete 1 of the 2 Google courses and submit your certificate before 30/04/2026.

Best regards,
HR VNG Games`

export default function EmailReminderModal({ targetUser, missingCount = 0, onClose, onSent }: Props) {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [subject, setSubject] = useState(DEFAULT_SUBJECT)
  const [body, setBody] = useState(DEFAULT_BODY)
  const [sending, setSending] = useState(false)

  const isSingle = !!targetUser

  const handleSend = async () => {
    setSending(true)
    try {
      if (isSingle) {
        await post(`/admin/single-email/${targetUser.id}`, { subject, body })
      } else {
        await post('/admin/bulk-email', { subject, body })
      }
      showToast(isSingle ? `Email sent to ${targetUser.name}` : 'Reminder emails sent', 'success')
      onSent()
      onClose()
    } catch (e: unknown) {
      const err = e as { message?: string }
      showToast(err?.message || 'Failed to send email', 'error')
    } finally {
      setSending(false)
    }
  }

  const subtitle = isSingle
    ? `Sending to: ${targetUser.name} (${targetUser.email})`
    : `Sending to ${missingCount} employees who have not completed training.`

  const footer = (
    <>
      <button className="btn-secondary sm" onClick={onClose}>{t('btn_cancel')}</button>
      <button className="btn-primary sm" onClick={handleSend} disabled={sending}>
        {sending ? 'Sending…' : `${t('btn_send_now')} ✉️`}
      </button>
    </>
  )

  return (
    <BaseModal
      title={`📧 ${t('email_modal_title')}`}
      subtitle={subtitle}
      onClose={onClose}
      footer={footer}
    >
      <div className="form-row">
        <label className="fl">{t('email_subject_label')}</label>
        <input
          className="fi"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="form-row">
        <label className="fl">{t('email_body_label')}</label>
        <textarea
          className="fi"
          rows={5}
          style={{ resize: 'vertical' }}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
    </BaseModal>
  )
}
