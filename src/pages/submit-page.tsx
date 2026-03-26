/** Submit page — auth banner, tab switcher, file upload / URL input, verify flow, success overlay. */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'
import FileUploadZone from '../components/file-upload-zone'
import UrlInputValidator from '../components/url-input-validator'
import VerifyFlowAnimation from '../components/verify-flow-animation'
import SuccessOverlay from '../components/success-overlay'
import styles from './submit-page.module.css'

type Tab = 'file' | 'url'

const COURSES = [
  { value: 'Google AI Essentials', labelKey: 'course_ai_essentials' },
  { value: 'Foundations of Cybersecurity', labelKey: 'course_cybersecurity' },
]

export default function SubmitPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [tab, setTab] = useState<Tab>('file')
  const [course, setCourse] = useState(COURSES[0].value)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [certUrl, setCertUrl] = useState('')
  const [urlValid, setUrlValid] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const canSubmit = tab === 'file' ? selectedFile !== null : urlValid

  function handleUrlChange(url: string, valid: boolean) {
    setCertUrl(url)
    setUrlValid(valid)
  }

  function handleSubmit() {
    if (!canSubmit) return
    setVerifying(true)
  }

  function handleRetry() {
    setVerifying(false)
    setSelectedFile(null)
    setCertUrl('')
    setUrlValid(false)
  }

  function handleFinish() {
    setShowSuccess(true)
  }

  return (
    <>
      <SuccessOverlay
        visible={showSuccess}
        email={user?.email ?? ''}
      />

      <div className={styles.submitLayout}>
        {!verifying ? (
          <>
            <div>
              <h2 className={styles.pageTitle}>{t('submit_title')}</h2>
              <p className={styles.pageSub}>{t('submit_sub')}</p>
            </div>

            {/* Auth banner */}
            <div className={styles.authBanner}>
              <div className={styles.authIcon}>🔐</div>
              <div>
                <div className={styles.authTextVerified}>{t('auth_verified')}</div>
                <p className={styles.authTextEmail}>
                  {user ? `${user.email} — ${user.department}` : '…'}
                </p>
              </div>
            </div>

            {/* Course selector */}
            <div className={styles.courseSelector}>
              <label className={styles.courseSelectorLabel}>{t('select_course') ?? 'Select course'}</label>
              <select
                className={styles.courseSelect}
                value={course}
                onChange={e => setCourse(e.target.value)}
              >
                {COURSES.map(c => (
                  <option key={c.value} value={c.value}>
                    {t(c.labelKey, c.value)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tab switcher */}
            <div className={styles.tabSwitcher}>
              <button
                className={`${styles.tabBtn} ${tab === 'file' ? styles.active : ''}`}
                onClick={() => setTab('file')}
              >
                📁 {t('tab_file')}
              </button>
              <button
                className={`${styles.tabBtn} ${tab === 'url' ? styles.active : ''}`}
                onClick={() => setTab('url')}
              >
                🔗 {t('tab_url')}
              </button>
            </div>

            {/* Panels */}
            {tab === 'file' ? (
              <FileUploadZone
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
              />
            ) : (
              <UrlInputValidator
                value={certUrl}
                onChange={handleUrlChange}
              />
            )}

            {/* Actions */}
            <div className={styles.actionRow}>
              <button className="btn-secondary sm" onClick={() => navigate('/')}>
                ← {t('btn_back')}
              </button>
              <button
                className={`btn-primary sm ${!canSubmit ? styles.submitBtnDisabled : ''}`}
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                {t('btn_submit_verify')} →
              </button>
            </div>
          </>
        ) : (
          <VerifyFlowAnimation
            file={tab === 'file' ? selectedFile : null}
            url={tab === 'url' ? certUrl : ''}
            course={course}
            onFinish={handleFinish}
            onRetry={handleRetry}
          />
        )}
      </div>
    </>
  )
}
