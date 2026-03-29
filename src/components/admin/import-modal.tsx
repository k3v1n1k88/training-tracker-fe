/** Import employees modal — download template + upload CSV/Excel file. */

import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { upload, downloadBlob } from '../../services/api-client'
import BaseModal from '../ui/base-modal'

interface Props {
  onClose: () => void
  onImported: () => void
}

interface ImportResult {
  created: number
  skipped: number
}

export default function ImportModal({ onClose, onImported }: Props) {
  const { t } = useTranslation()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState('')

  const handleDownloadTemplate = () => {
    downloadBlob('/users/import-template', 'employee_import_template.xlsx')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    setFile(selected)
    setError('')
    setResult(null)
  }

  const handleImport = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await upload<ImportResult>('/users/import', file)
      setResult(res)
      onImported()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Import failed')
    } finally {
      setLoading(false)
    }
  }

  const footer = result ? (
    <button className="btn-primary sm" onClick={onClose}>{t('btn_done')}</button>
  ) : (
    <>
      <button className="btn-secondary sm" onClick={onClose}>{t('btn_cancel')}</button>
      <button className="btn-primary sm" onClick={handleImport} disabled={!file || loading}>
        {loading ? t('import_uploading') : t('btn_import')}
      </button>
    </>
  )

  return (
    <BaseModal
      title={`📥 ${t('import_title')}`}
      subtitle={t('import_subtitle')}
      onClose={onClose}
      footer={footer}
      maxWidth={480}
    >
      {/* Step 1: Download template */}
      <div className="form-row">
        <label className="fl">{t('import_step1')}</label>
        <button className="btn-ghost" onClick={handleDownloadTemplate} style={{ textDecoration: 'underline', color: 'var(--primary)' }}>
          📄 {t('import_download_template')}
        </button>
      </div>

      {/* Step 2: Upload file */}
      <div className="form-row">
        <label className="fl">{t('import_step2')}</label>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="fi"
        />
      </div>

      {/* Result banner */}
      {result && (
        <div style={{ padding: '10px 12px', borderRadius: 6, background: 'var(--green-light, #C6EFCE)', color: '#276221', fontSize: 13, marginTop: 8 }}>
          ✅ {t('import_result', { created: result.created, skipped: result.skipped })}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div style={{ padding: '10px 12px', borderRadius: 6, background: '#FFC7CE', color: '#9C0006', fontSize: 13, marginTop: 8 }}>
          ❌ {error}
        </div>
      )}
    </BaseModal>
  )
}
