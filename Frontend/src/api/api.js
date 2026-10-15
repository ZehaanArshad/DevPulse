import { apiFetch } from './client'
import { setToken, setUserId } from './auth'

export async function signup(username, password) {
  return apiFetch('/signup', { method: 'POST', body: { username, password } })
}

export async function login(username, password) {
  const data = await apiFetch('/login', { method: 'POST', body: { username, password } })
  setToken(data.access_token)
  const me = await getMe()
  setUserId(me.id)
  return data
}

export function getMe() {
  return apiFetch('/me')
}

export function getProfiles(userId) {
  return apiFetch(`/users/${userId}/profiles`)
}

export function linkProfile(userId, platform, handle) {
  return apiFetch(`/users/${userId}/profiles`, { method: 'POST', body: { platform, handle } })
}

export function deleteProfile(userId, profileId) {
  return apiFetch(`/users/${userId}/profiles/${profileId}`, { method: 'DELETE' })
}

export function getStats(userId) {
  return apiFetch(`/users/${userId}/stats`)
}
