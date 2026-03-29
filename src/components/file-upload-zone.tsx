/** Drag-and-drop file upload area — accepts PDF only (up to 10MB). */

import { useRef, useState, type DragEvent, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './file-upload-zone.module.css'

interface FileUploadZoneProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
}

const ACCEPTED_TYPES = ['application/pdf']
const MAX_BYTES = 10 * 1024 * 1024 // 10MB

export default function FileUploadZone({ onFileSelect, selectedFile }: FileUploadZoneProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function validateAndSet(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(t('upload_error_type'))
      onFileSelect(null)
      return
    }
    if (file.size > MAX_BYTES) {
      setError(t('upload_error_size'))
      onFileSelect(null)
      return
    }
    setError(null)
    onFileSelect(file)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) validateAndSet(file)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) validateAndSet(file)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  const hasFile = selectedFile !== null

  return (
    <>
      <div
        className={`${styles.uploadZone} ${dragging ? styles.dragging : ''} ${hasFile ? styles.hasFile : ''}`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className={styles.uploadIcon}>{hasFile ? '✅' : '☁️'}</div>
        <div className={styles.uploadHint}>
          {hasFile ? selectedFile!.name : t('upload_hint')}
        </div>
        {!hasFile && (
          <div className={styles.uploadSub}>{t('upload_sub')}</div>
        )}
        {hasFile && (
          <div className={styles.fileInfo}>
            {(selectedFile!.size / 1024).toFixed(0)} KB
          </div>
        )}
      </div>

      {error && <div className={styles.errorMsg}>⚠ {error}</div>}

      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        accept=".pdf"
        onChange={handleChange}
      />
    </>
  )
}
