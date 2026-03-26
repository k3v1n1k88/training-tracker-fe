/** Landing page — hero, course grid, step guide sidebar. */

import { useTranslation } from 'react-i18next'
import HeroSection from '../components/hero-section'
import CourseCard from '../components/course-card'
import StepGuideSidebar from '../components/step-guide-sidebar'
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

  return (
    <div className={styles.landingLayout}>
      <div className={styles.landingMain}>
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
