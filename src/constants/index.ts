/** Shared constants — courses, departments, countries, status maps. */

export const COURSES = ['AI Essentials', 'Cybersecurity'] as const
export const DEPARTMENTS = ['Engineering', 'Product', 'Marketing', 'Design', 'HR', 'Finance', 'Operations', 'QA'] as const
export const COUNTRIES = ['VN', 'MY', 'KR', 'CN-SHA', 'CN-GZ'] as const

export const STATUS_BADGE: Record<string, string> = {
  done: 'badge badge-green',
  pending: 'badge badge-orange',
  missing: 'badge badge-red',
}

export const STATUS_KEY: Record<string, string> = {
  done: 'badge_done',
  pending: 'badge_pending',
  missing: 'badge_missing',
}
