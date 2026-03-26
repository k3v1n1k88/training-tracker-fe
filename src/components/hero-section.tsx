/** Hero section for landing page — eyebrow badge, title, subtitle, CTA button. */

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styles from '../pages/landing-page.module.css'

export default function HeroSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className={styles.hero}>
      <div className={styles.heroEyebrow}>{t('hero_eyebrow')}</div>

      <h1 className={styles.heroTitle}>
        {t('hero_title_line1')}
        <br />
        <span>{t('hero_title_line2')}</span>
      </h1>

      <p
        className={styles.heroSub}
        dangerouslySetInnerHTML={{ __html: t('hero_sub') }}
      />

      <div className={styles.heroCta}>
        <button className="btn-primary" onClick={() => navigate('/submit')}>
          {t('hero_cta1')} ↗
        </button>
      </div>
    </div>
  )
}
