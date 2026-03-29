/** URL input with real-time validation against certificate URL whitelist patterns. */

import { type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import styles from '../pages/submit-page.module.css'

const VALID_PATTERNS = [
  'linkedin.com/learning/certificates/',
  'linkedin.com/feed/update/',
  'coursera.org/verify/',
  'coursera.org/account/accomplishments/',
  'grow.google/',
  'learndigital.withgoogle.com/',
  'cloudskillsboost.google/',
  'credential.net/',
  'credly.com/badges/',
]

export function isValidCertUrl(url: string): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) return false
    return VALID_PATTERNS.some(pattern => url.includes(pattern))
  } catch {
    return false
  }
}

interface UrlInputValidatorProps {
  value: string
  onChange: (url: string, valid: boolean) => void
}

export default function UrlInputValidator({ value, onChange }: UrlInputValidatorProps) {
  const { t } = useTranslation()

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const url = e.target.value
    onChange(url, isValidCertUrl(url))
  }

  const showValid = value.length > 0 && isValidCertUrl(value)
  const showInvalid = value.length > 0 && !isValidCertUrl(value)

  return (
    <div className={styles.urlPanel}>
      <div className={styles.urlLabel}>{t('url_label')}</div>
      <input
        className="fi"
        type="url"
        placeholder="https://linkedin.com/learning/certificates/... or https://coursera.org/verify/..."
        value={value}
        onChange={handleChange}
        style={{ fontSize: 13, padding: '11px 14px' }}
      />
      <div className={styles.urlHint}>{t('url_hint')}</div>

      {showValid && (
        <div className={styles.urlValidMsg}>
          ✅ {t('url_valid_msg')}
        </div>
      )}
      {showInvalid && (
        <div className={styles.urlInvalidMsg}>
          ⚠ {t('url_invalid_msg')}
        </div>
      )}

      <div className={styles.urlQuickLinks}>
        <a
          href="https://www.linkedin.com/learning/what-is-generative-ai"
          target="_blank"
          rel="noreferrer"
          className={styles.urlQuickLink}
        >
          🔗 What is Generative AI (LinkedIn Learning)
        </a>
      </div>
    </div>
  )
}
