/** Fetch wrapper with auth handling and JSON convenience. */

const BASE_URL = '/api'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    // Don't auto-redirect — let callers handle 401 (e.g., navbar shows Sign In)
    throw new ApiError(401, 'Unauthorized')
  }
  if (!res.ok) {
    const body = await res.text()
    throw new ApiError(res.status, body || res.statusText)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { credentials: 'include' })
  return handleResponse<T>(res)
}

export async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(res)
}

export async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  return handleResponse<T>(res)
}

export async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  return handleResponse<T>(res)
}

export async function upload<T>(path: string, file: File, fields?: Record<string, string>): Promise<T> {
  const form = new FormData()
  form.append('file', file)
  if (fields) {
    for (const [key, value] of Object.entries(fields)) {
      form.append(key, value)
    }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  })
  return handleResponse<T>(res)
}

/** POST form-urlencoded data (for endpoints using Form(...) params). */
export async function postForm<T>(path: string, fields: Record<string, string>): Promise<T> {
  const form = new URLSearchParams()
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value)
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  })
  return handleResponse<T>(res)
}

/** Download a file (e.g., Excel export) */
export async function downloadBlob(path: string, filename: string): Promise<void> {
  const res = await fetch(`${BASE_URL}${path}`, { credentials: 'include' })
  if (!res.ok) throw new ApiError(res.status, 'Download failed')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
