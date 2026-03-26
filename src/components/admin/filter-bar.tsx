/** 2-row filter bar: status pills + search (row1), dropdowns + date range (row2). */

import { useTranslation } from 'react-i18next'
import styles from '../../pages/admin-page.module.css'
import { DEPARTMENTS, COURSES, COUNTRIES } from '../../constants'

export type StatusFilter = 'all' | 'done' | 'pending' | 'missing'

export interface Filters {
  status: StatusFilter
  search: string
  dept: string
  course: string
  country: string
  from: string
  to: string
}

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  onClear: () => void
}


export default function FilterBar({ filters, onChange, onClear }: Props) {
  const { t } = useTranslation()

  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })

  const activeCount = [filters.dept, filters.course, filters.country, filters.from, filters.to]
    .filter(Boolean).length

  const pills: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: t('filter_all') },
    { key: 'done', label: `✅ ${t('filter_done')}` },
    { key: 'pending', label: `⏳ ${t('filter_pending')}` },
    { key: 'missing', label: `❌ ${t('filter_missing')}` },
  ]

  return (
    <div className={styles.advFilterBar}>
      {/* Row 1: status pills + search */}
      <div className={styles.filterRow}>
        <div style={{ display: 'flex', gap: 4 }}>
          {pills.map((p) => (
            <button
              key={p.key}
              className={`fbtn${filters.status === p.key ? ' active' : ''}`}
              onClick={() => set({ status: p.key })}
            >
              {p.label}
            </button>
          ))}
        </div>
        <input
          className="filter-search"
          placeholder={`🔍 ${t('th_staff')}...`}
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          style={{ marginLeft: 'auto' }}
        />
      </div>

      {/* Row 2: dropdowns + date range + clear */}
      <div className={styles.filterRow}>
        <label className="adv-filter-label">{t('filter_dept')}</label>
        <select className="adv-select" value={filters.dept} onChange={(e) => set({ dept: e.target.value })}>
          <option value="">All</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>

        <div className="adv-divider" />

        <label className="adv-filter-label">{t('filter_course')}</label>
        <select className="adv-select" value={filters.course} onChange={(e) => set({ course: e.target.value })}>
          <option value="">All</option>
          {COURSES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <div className="adv-divider" />

        <label className="adv-filter-label">{t('filter_country')}</label>
        <select className="adv-select" value={filters.country} onChange={(e) => set({ country: e.target.value })}>
          <option value="">All</option>
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <div className="adv-divider" />

        <label className="adv-filter-label">{t('filter_from')}</label>
        <input type="date" className="adv-select adv-date" value={filters.from} onChange={(e) => set({ from: e.target.value })} />

        <label className="adv-filter-label">{t('filter_to')}</label>
        <input type="date" className="adv-select adv-date" value={filters.to} onChange={(e) => set({ to: e.target.value })} />

        <button className="adv-clear" onClick={onClear} style={{ marginLeft: 'auto' }}>
          ✕ {t('btn_clear_filters')}{' '}
          <span className={`filter-count${activeCount > 0 ? ' show' : ''}`}>{activeCount}</span>
        </button>
      </div>
    </div>
  )
}
