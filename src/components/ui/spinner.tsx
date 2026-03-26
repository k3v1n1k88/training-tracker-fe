/** Simple CSS spinner for loading states. */
import styles from './spinner.module.css'

export default function Spinner({ size = 24 }: { size?: number }) {
  return <div className={styles.spinner} style={{ width: size, height: size }} />
}
