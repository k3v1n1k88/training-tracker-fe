/** Course card — course number, name, description, meta tags, external link button + submission status. */

import { useTranslation } from 'react-i18next'
import styles from './course-card.module.css'

interface SubmissionInfo {
  status: string
  submitted_at: string
  reject_note?: string | null
}

interface CourseCardProps {
  number: string
  name: string
  descKey: string
  durKey: string
  href: string
  submission?: SubmissionInfo | null
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending:  { label: 'Reviewing',  cls: 'badgePending' },
  done:     { label: 'Completed',  cls: 'badgeDone' },
  rejected: { label: 'Rejected',   cls: 'badgeRejected' },
}

export default function CourseCard({ number, name, descKey, durKey, href, submission }: CourseCardProps) {
  const { t } = useTranslation()
  const badge = submission ? STATUS_BADGE[submission.status] : null

  return (
    <div className={styles.card}>
      {badge && (
        <span className={`${styles.statusBadge} ${styles[badge.cls]}`}>{badge.label}</span>
      )}
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
