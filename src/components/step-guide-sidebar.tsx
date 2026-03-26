/** Step guide sidebar — 5 numbered steps + deadline box + submit CTA. */

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styles from './step-guide-sidebar.module.css'

const STEPS = [
  { numKey: '1', headKey: 'step1_h', bodyKey: 'step1_p', done: false },
  { numKey: '2', headKey: 'step2_h', bodyKey: 'step2_p', done: false },
  { numKey: '3', headKey: 'step3_h', bodyKey: 'step3_p', done: false },
  { numKey: '4', headKey: 'step4_h', bodyKey: 'step4_p', done: false },
  { numKey: '✓', headKey: 'step5_h', bodyKey: 'step5_p', done: true },
]

export default function StepGuideSidebar() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <div className={styles.sbTitle}>{t('sb_guide_title')}</div>

      <div className={styles.stepList}>
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`${styles.stepItem} ${i === STEPS.length - 1 ? styles.stepItemLast : ''}`}
          >
            <div className={`${styles.stepCircle} ${step.done ? styles.done : styles.num}`}>
              {step.numKey}
            </div>
            <div className={styles.stepBody}>
              <h4>{t(step.headKey)}</h4>
              <p>{t(step.bodyKey)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.deadlineBox}>
        <div className={styles.dlLabel}>{t('deadline_label')}</div>
        <div className={styles.dlDate}>{t('deadline_date')}</div>
        <div className={styles.dlSub}>{t('deadline_sub')}</div>
      </div>

      <div className={styles.sidebarCta}>
        <button
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '10px 16px' }}
          onClick={() => navigate('/submit')}
        >
          {t('hero_cta1')} →
        </button>
      </div>
    </>
  )
}
