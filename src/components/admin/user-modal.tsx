/** Add/Edit employee modal — fields: name, email, department, role, country. */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { post, put } from '../../services/api-client'
import BaseModal from '../ui/base-modal'
import { DEPARTMENTS, COUNTRIES } from '../../constants'

export interface UserPayload {
  id?: number
  name: string
  email: string
  department: string
  role: string
  country: string
}

interface Props {
  mode: 'add' | 'edit'
  initial?: Partial<UserPayload>
  onClose: () => void
  onSaved: () => void
}


export default function UserModal({ mode, initial, onClose, onSaved }: Props) {
  const { t } = useTranslation()
  const [form, setForm] = useState<UserPayload>({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    department: initial?.department ?? 'Engineering',
    role: initial?.role ?? '',
    country: initial?.country ?? 'VN',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (patch: Partial<UserPayload>) => setForm((f) => ({ ...f, ...patch }))

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (mode === 'edit' && initial?.id) {
        await put(`/users/${initial.id}`, form)
      } else {
        await post('/users', form)
      }
      onSaved()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const footer = (
    <>
      <button className="btn-secondary sm" onClick={onClose}>{t('btn_cancel')}</button>
      <button className="btn-primary sm" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : t('btn_save')}
      </button>
    </>
  )

  return (
    <BaseModal
      title={mode === 'add' ? `＋ ${t('btn_add_staff')}` : `✏️ Edit Employee`}
      subtitle={mode === 'add' ? 'Fill in the details for the new employee.' : `Editing: ${initial?.name}`}
      onClose={onClose}
      footer={footer}
    >
      {error && <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 8 }}>{error}</div>}

      <div className="form-row">
        <label className="fl">{t('um_name')} <span style={{ color: 'var(--red)' }}>*</span></label>
        <input className="fi" value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Nguyen Van A" />
      </div>
      <div className="form-row">
        <label className="fl">{t('um_email')} <span style={{ color: 'var(--red)' }}>*</span></label>
        <input className="fi" value={form.email} onChange={(e) => set({ email: e.target.value })} placeholder="vana@vnggames.com" />
      </div>
      <div className="form-row">
        <label className="fl">{t('um_dept')}</label>
        <select className="fi" value={form.department} onChange={(e) => set({ department: e.target.value })}>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div className="form-row">
        <label className="fl">{t('um_role')}</label>
        <input className="fi" value={form.role} onChange={(e) => set({ role: e.target.value })} placeholder="Software Engineer" />
      </div>
      <div className="form-row">
        <label className="fl">{t('um_country')}</label>
        <select className="fi" value={form.country} onChange={(e) => set({ country: e.target.value })}>
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
    </BaseModal>
  )
}
