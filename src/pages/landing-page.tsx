/** Landing page — hero, course grid, step guide sidebar. */

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'
import { get } from '../services/api-client'
import HeroSection from '../components/hero-section'
import CourseCard from '../components/course-card'
import StepGuideSidebar from '../components/step-guide-sidebar'
import AuthErrorDialog from '../components/auth-error-dialog'
import styles from './landing-page.module.css'

const COURSES = [
  {
    number: 'COURSE · 01',
    name: 'Google AI Essentials',
    descKey: 'course1_desc',
    durKey: 'course1_dur',
    href: 'https://grow.google/intl/en_us/courses-and-tools/google-ai-essentials/',
  },
  {
    number: 'COURSE · 02',
    name: 'Foundations of Cybersecurity',
    descKey: 'course2_desc',
    durKey: 'course2_dur',
    href: 'https://www.coursera.org/learn/foundations-of-cybersecurity',
  },
]

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

  return (
    <div className={styles.landingLayout}>
      <div className={styles.landingMain}>
        {authError && <AuthErrorDialog error={authError} onDismiss={dismissError} />}
        <HeroSection />

        <div className={styles.sectionLabel}>
          <span>{t('section_courses')}</span>
          <span className={styles.chooseBadge}>{t('choose_one')}</span>
        </div>

        <div className={styles.coursesGrid}>
          {COURSES.map(course => (
            <CourseCard
              key={course.number}
              number={course.number}
              name={course.name}
              descKey={course.descKey}
              durKey={course.durKey}
              href={course.href}
              submission={submission?.course === course.name ? submission : null}
            />
          ))}
        </div>
      </div>

      <div className={styles.landingSidebar}>
        <StepGuideSidebar />
      </div>
    </div>
  )
}
