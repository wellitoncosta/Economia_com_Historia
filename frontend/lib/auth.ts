import type { Role, Utilizador } from './types'

const TOKEN_KEY = 'authToken'
const USER_KEY = 'authUser'
const TOKEN_COOKIE = 'auth_token'

export const roleLabels: Record<Role, string> = {
  VISITANTE: 'Visitante',
  INSCRITO: 'Inscrito',
  CRIADOR: 'Criador',
  REVISOR: 'Revisor',
  MASTER: 'Master',
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): Utilizador | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Utilizador
  } catch {
    return null
  }
}

export function storeSession(token: string, user: Utilizador) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=604800; samesite=lax`
}

export function storeUser(user: Utilizador) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`
}

export function hasAnyRole(role: Role | undefined, allowed: Role[]) {
  return !!role && allowed.includes(role)
}
