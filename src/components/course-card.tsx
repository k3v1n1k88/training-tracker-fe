/** Course card — course number, name, description, meta tags, external link button. */

import { useTranslation } from 'react-i18next'
import styles from './course-card.module.css'

interface CourseCardProps {
  number: string
  name: string
  descKey: string
  durKey: string
  href: string
}

export default function CourseCard({ number, name, descKey, durKey, href }: CourseCardProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.card}>
      <div className={styles.courseNum}>{number}</div>
      <div className={styles.courseName}>{name}</div>
      <div className={styles.courseDesc}>{t(descKey)}</div>
      <div className={styles.courseMeta}>
        <span className={styles.courseTag}>{t(durKey)}</span>
        <span className={styles.courseTag}>🆓 {t('free')}</span>
        <span className={styles.courseTag}>🎓 {t('has_cert')}</span>
      </div>
      <a
        className={styles.courseLinkBtn}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {t('start_course')} ↗
      </a>
    </div>
  )
}
