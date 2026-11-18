import { apiFetch } from './client'
import { setToken, setUserId } from './auth'

export async function signup(username, email, password) {

  return apiFetch('/signup', { method: 'POST', body: { username, email, password } })

}

export async function login(email, password) {

  const data = await apiFetch('/login', { method: 'POST', body: { email, password } })

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
