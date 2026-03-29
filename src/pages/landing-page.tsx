/** Landing page — hero, course block with learning outcomes, step guide sidebar. */

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'
import { get } from '../services/api-client'
import HeroSection from '../components/hero-section'
import StepGuideSidebar from '../components/step-guide-sidebar'
import AuthErrorDialog from '../components/auth-error-dialog'
import styles from './landing-page.module.css'

/** LinkedIn Learning course — primary course for this training cycle */
const PRIMARY_COURSE = {
  name: 'What is Generative AI',
  href: 'https://www.linkedin.com/learning/what-is-generative-ai',
  outcomeKeys: ['course1_outcome1', 'course1_outcome2', 'course1_outcome3'] as const,
}

export default function LandingPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const authError = searchParams.get('error')
  const [submission, setSubmission] = useState<any>(null)

  useEffect(() => {
    if (!user) return
    get('/submissions/my').then(setSubmission).catch(() => {})
  }, [user])

  const dismissError = () => {
    searchParams.delete('error')
    setSearchParams(searchParams, { replace: true })
  }

  const hasSubmission = submission?.course === PRIMARY_COURSE.name

  return (
    <div className={styles.landingLayout}>
      <div className={styles.landingMain}>
        {authError && <AuthErrorDialog error={authError} onDismiss={dismissError} />}
        <HeroSection />

        <div className={styles.sectionLabel}>
          <span>{t('section_courses')}</span>
        </div>

        {/* Single course block with learning outcomes */}
        <div className={styles.courseBlock}>
          {hasSubmission && submission && (
            <span className={`${styles.courseStatusBadge} ${styles[`status_${submission.status}`]}`}>
              {submission.status === 'done' ? t('badge_done') : submission.status === 'pending' ? t('badge_pending') : t('badge_missing')}
            </span>
          )}
          <div className={styles.coursePlatformTag}>LinkedIn Learning</div>
          <h3 className={styles.courseBlockTitle}>{t('course1_name')}</h3>
          <p className={styles.courseBlockDesc}>{t('course1_desc')}</p>
          <ul className={styles.courseOutcomes}>
            {PRIMARY_COURSE.outcomeKeys.map(key => (
              <li key={key} className={styles.courseOutcomeItem}>
                <span className={styles.outcomeCheck}>✓</span>
                {t(key)}
              </li>
            ))}
          </ul>
          <a
            className={styles.courseLinkBtn}
            href={PRIMARY_COURSE.href}
            target="_blank"
            rel="noreferrer"
          >
            {t('start_course')} ↗
          </a>
        </div>
      </div>

      <div className={styles.landingSidebar}>
        <StepGuideSidebar />
      </div>
    </div>
  )
}
