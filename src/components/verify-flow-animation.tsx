/** Verify flow animation — scanning → success | failed states with real API call. */

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { upload, postForm } from '../services/api-client'
import styles from './verify-flow-animation.module.css'

type VerifyState = 'scanning' | 'success' | 'failed'

interface CertResult {
  learner?: string
  course?: string
  issuer?: string
  date?: string
  code?: string
  error?: string
  hint?: string
}

interface VerifyFlowAnimationProps {
  file: File | null
  url: string
  course: string
  onFinish: () => void
  onRetry: () => void
}

const CHECK_KEYS = ['check_format', 'check_issuer', 'check_name', 'check_course', 'check_date']

export default function VerifyFlowAnimation({ file, url, course, onFinish, onRetry }: VerifyFlowAnimationProps) {
  const { t } = useTranslation()
  const [state, setState] = useState<VerifyState>('scanning')
  const [progress, setProgress] = useState(0)
  const [checkedCount, setCheckedCount] = useState(0)
  const [result, setResult] = useState<CertResult>({})
  const apiCalledRef = useRef(false)

  useEffect(() => {
    if (apiCalledRef.current) return
    apiCalledRef.current = true

    // Animate progress bar and check items over ~3s
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(progressInterval); return 90 }
        return p + 3
      })
    }, 100)

    const checkIntervals = CHECK_KEYS.map((_, i) =>
      setTimeout(() => setCheckedCount(c => Math.max(c, i + 1)), 500 + i * 500)
    )

    // Fire real API call
    const apiCall = file
      ? upload<CertResult>('/submissions/upload', file, { course })
      : postForm<CertResult>('/submissions/url', { course, certificate_url: url })

    apiCall
      .then(data => {
        clearInterval(progressInterval)
        setProgress(100)
        setCheckedCount(CHECK_KEYS.length)
        setTimeout(() => {
          setResult(data)
          setState('success')
        }, 600)
      })
      .catch(() => {
        clearInterval(progressInterval)
        setProgress(100)
        setCheckedCount(CHECK_KEYS.length)
        setTimeout(() => setState('failed'), 600)
      })

    return () => {
      clearInterval(progressInterval)
      checkIntervals.forEach(clearTimeout)
    }
  }, [file, url])

  if (state === 'scanning') {
    return (
      <div>
        <h2 className={styles.stateTitle}>{t('verify_scanning_title')}</h2>
        <p className={styles.stateSub}>{t('verify_scanning_sub')}</p>

        <div className={styles.scanBox}>
          <div className={styles.scanIcon}>🔍</div>
          <div className={styles.scanLabel}>{t('verify_analyzing') ?? 'Analyzing certificate…'}</div>
          <div className={styles.scanFileName}>{file?.name ?? url}</div>
          <div className={styles.scanBarWrap}>
            <div className={styles.scanBarFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.scanChecks}>
            {CHECK_KEYS.map((key, i) => (
              <div key={key} className={styles.ck}>
                <div className={`${styles.ckDot} ${i < checkedCount ? styles.dok : i === checkedCount ? styles.dc : styles.dp}`} />
                <span>{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div>
        <h2 className={styles.stateTitle}>{t('verify_success_title')}</h2>
        <p className={styles.stateSub}>{t('verify_success_sub')}</p>

        <div className={`${styles.resultCard} ${styles.success}`}>
          <div className={styles.resultIcon}>✅</div>
          <div className={`${styles.resultTitle} ${styles.green}`}>{t('cert_valid') ?? 'Certificate Valid'}</div>
          <div className={styles.resultSub}>{t('cert_valid_sub') ?? 'Congratulations! You have met the Q1/2026 training requirement.'}</div>
          {result.learner && (
            <div className={styles.certDetail}>
              <div className={styles.certRow}><span className={styles.certKey}>{t('cert_learner') ?? 'Learner'}</span><span className={`${styles.certVal} ${styles.ok}`}>{result.learner}</span></div>
              <div className={styles.certRow}><span className={styles.certKey}>{t('cert_course_label') ?? 'Course'}</span><span className={`${styles.certVal} ${styles.ok}`}>{result.course}</span></div>
              <div className={styles.certRow}><span className={styles.certKey}>{t('cert_issuer_label') ?? 'Issuer'}</span><span className={`${styles.certVal} ${styles.ok}`}>{result.issuer}</span></div>
              <div className={styles.certRow}><span className={styles.certKey}>{t('cert_date_label') ?? 'Completed'}</span><span className={`${styles.certVal} ${styles.ok}`}>{result.date}</span></div>
              {result.code && <div className={styles.certRow}><span className={styles.certKey}>{t('cert_code_label') ?? 'Code'}</span><span className={`${styles.certVal} ${styles.ok}`}>{result.code}</span></div>}
            </div>
          )}
        </div>

        <div className={styles.actionRow}>
          <button className="btn-secondary sm" onClick={onRetry}>{t('btn_resubmit') ?? 'Resubmit'}</button>
          <button className="btn-primary sm" onClick={onFinish}>{t('btn_finish')}</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className={styles.stateTitle}>{t('verify_fail_title')}</h2>
      <p className={styles.stateSub}>{t('verify_fail_sub')}</p>

      <div className={`${styles.resultCard} ${styles.failed}`}>
        <div className={styles.resultIcon}>❌</div>
        <div className={`${styles.resultTitle} ${styles.redLight}`}>{t('cert_invalid') ?? 'Certificate Invalid'}</div>
        <div className={styles.resultSub}>{t('cert_invalid_sub') ?? 'File is not a valid Google / Coursera certificate or does not match your account.'}</div>
        {(result.error || result.hint) && (
          <div className={styles.certDetail}>
            {result.error && <div className={styles.certRow}><span className={styles.certKey}>{t('cert_error_label') ?? 'Error'}</span><span className={styles.certVal} style={{ color: 'var(--red-light)' }}>{result.error}</span></div>}
            {result.hint && <div className={styles.certRow}><span className={styles.certKey}>{t('cert_hint_label') ?? 'Hint'}</span><span className={styles.certVal} style={{ color: 'var(--orange)' }}>{result.hint}</span></div>}
          </div>
        )}
      </div>

      <div className={styles.actionRow}>
        <button className="btn-primary sm" onClick={onRetry}>{t('btn_retry')}</button>
      </div>
    </div>
  )
}
