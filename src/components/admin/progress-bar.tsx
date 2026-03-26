/** Completion progress bar with gradient fill and legend. */

import { useTranslation } from 'react-i18next'
import styles from '../../pages/admin-page.module.css'

interface Props {
  pct: number
  done: number
  pending: number
  missing: number
}

export default function ProgressBar({ pct, done, pending, missing }: Props) {
  const { t } = useTranslation()

  return (
    <div className={styles.progWrap}>
      <div className={styles.progCard}>
        <div className={styles.progTop}>
          <h3>{t('prog_title')}</h3>
          <span className={styles.progPct}>{pct}%</span>
        </div>
        <div className={styles.progBar}>
          <div className={styles.progFill} style={{ width: `${pct}%` }} />
        </div>
        <div className={styles.progLegend}>
          <span>
            <span className={styles.ldot} style={{ background: 'var(--green)' }} />
            {t('filter_done')}: {done}
          </span>
          <span>
            <span className={styles.ldot} style={{ background: 'var(--orange)' }} />
            {t('filter_pending')}: {pending}
          </span>
          <span>
            <span className={styles.ldot} style={{ background: 'var(--red)' }} />
            {t('filter_missing')}: {missing}
          </span>
        </div>
      </div>
    </div>
  )
}
