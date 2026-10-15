import { getToken, clearToken } from './auth'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function apiFetch(path, options = {}) {

  const headers = {
    'Content-Type': 'application/json',
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(BASE_URL + path, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

    if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

    if (!response.ok) {
    if (response.status === 401 && token) {
      clearToken()
      window.location.href = '/login'
    }

    const error = new Error(data?.detail ?? 'Something went wrong')
    error.status = response.status
    error.detail = data?.detail
    throw error
  }


  return data

}

