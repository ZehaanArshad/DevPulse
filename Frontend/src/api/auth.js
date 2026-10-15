export function setToken(newToken) {
  localStorage.setItem('token', newToken)
}

export function getToken() {
  return localStorage.getItem('token')
}

export function setUserId(id) {
  localStorage.setItem('userId', id)
}

export function getUserId() {
  return localStorage.getItem('userId')
}

export function clearToken() {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
}

export function isLoggedIn() {
  return getToken() !== null
}
