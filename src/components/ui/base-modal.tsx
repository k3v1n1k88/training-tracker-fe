/** Reusable modal wrapper — overlay + card + close button. */
import { type ReactNode } from 'react'
import styles from '../../pages/admin-page.module.css'

interface BaseModalProps {
  title: string
  subtitle?: string
  onClose: () => void
  footer?: ReactNode
  children: ReactNode
  maxWidth?: number
}

export default function BaseModal({ title, subtitle, onClose, footer, children, maxWidth }: BaseModalProps) {
  return (
    <div className={`${styles.modalOv} ${styles.show}`}>
      <div className={styles.modal} style={maxWidth ? { maxWidth } : undefined}>
        <button className={styles.modalX} onClick={onClose}>✕</button>
        <div className={styles.modalTitle}>{title}</div>
        {subtitle && <div className={styles.modalSub}>{subtitle}</div>}
        {children}
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  )
}
