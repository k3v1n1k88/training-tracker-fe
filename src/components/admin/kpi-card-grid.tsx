/** 4 KPI cards fetched from GET /api/dashboard/stats */


import { useTranslation } from 'react-i18next'
import { get } from '../../services/api-client'
import styles from '../../pages/admin-page.module.css'

interface Stats {
  total: number
  approved: number
  pending: number
  missing: number
  rejected: number
  completion_pct: number
}

interface Props {
  stats: Stats | null
}

export default function KpiCardGrid({ stats }: Props) {
  const { t } = useTranslation()

  const cards = [
    { label: t('kpi_total'), val: stats?.total ?? '—', sub: t('kpi_total_sub'), cls: '' },
    { label: t('kpi_done'), val: stats?.approved ?? '—', sub: stats ? `${stats.completion_pct}% total` : '—', cls: 'green' },
    { label: t('kpi_missing'), val: stats?.missing ?? '—', sub: t('kpi_missing_sub'), cls: 'red' },
    { label: t('kpi_pending'), val: stats?.pending ?? '—', sub: t('kpi_pending_sub'), cls: 'orange' },
  ]

  return (
    <div className={styles.kpiGrid}>
      {cards.map((c) => (
        <div key={c.label} className={styles.kpiCard}>
          <div className={styles.kpiLbl}>{c.label}</div>
          <div className={`${styles.kpiVal}${c.cls ? ` ${styles[c.cls as keyof typeof styles]}` : ''}`}>
            {c.val}
          </div>
          <div className={styles.kpiDelta}>{c.sub}</div>
        </div>
      ))}
    </div>
  )
}

/** Fetch dashboard stats — re-exported for parent use */
export async function fetchStats(): Promise<Stats> {
  return get<Stats>('/dashboard/stats')
}
