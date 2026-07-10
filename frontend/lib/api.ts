import { getStoredToken } from './auth'
import type {
  ApiErrorResponse,
  AuthResponse,
  Comentario,
  Conteudo,
  Forum,
  PapelForum,
  PerguntaQuiz,
  RankingAgregado,
  RankingQuiz,
  Recomendacao,
  ResultadoQuiz,
  Role,
  SalaQuiz,
  Subscricao,
  TipoConteudo,
  TipoEntidadeVoto,
  TipoVoto,
  Topico,
  Utilizador,
} from './types'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export class ApiError extends Error {
  payload?: ApiErrorResponse
  status: number

  constructor(message: string, status: number, payload?: ApiErrorResponse) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

type ApiOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  token?: string | null
  query?: Record<string, string | number | boolean | undefined | null>
}

function buildUrl(path: string, query?: ApiOptions['query']) {
  const url = new URL(path, API_URL)
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
  })
  return url.toString()
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = options.token === undefined ? getStoredToken() : options.token
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body !== undefined) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(buildUrl(path, options.query), {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (response.status === 204) return undefined as T

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const payload = data as ApiErrorResponse | undefined
    const details = payload?.detalhes?.length ? ` ${payload.detalhes.join(' ')}` : ''
    throw new ApiError(`${payload?.mensagem || 'Erro ao comunicar com a API.'}${details}`, response.status, payload)
  }

  return data as T
}

export const api = {
  login: (body: { email: string; password: string }) => apiFetch<AuthResponse>('/api/auth/login', { method: 'POST', body }),
  register: (body: { email: string; password: string; regiao?: string; instituicao?: string }) =>
    apiFetch<AuthResponse>('/api/auth/register', { method: 'POST', body }),
  me: (token?: string | null) => apiFetch<Utilizador>('/api/auth/me', { token }),
  atualizarPerfil: (body: { regiao?: string; instituicao?: string }) =>
    apiFetch<Utilizador>('/api/usuarios/me', { method: 'PATCH', body }),
  alterarSenha: (body: { senhaAtual: string; novaSenha: string }) =>
    apiFetch<void>('/api/usuarios/me/senha', { method: 'PATCH', body }),
  solicitarRecuperacao: (email: string) =>
    apiFetch<{ mensagem: string }>('/api/recuperacao/solicitar', { method: 'POST', body: { email }, token: null }),
  validarOtp: (email: string, codigo: string) =>
    apiFetch<{ mensagem: string }>('/api/recuperacao/validar', { method: 'POST', body: { email, codigo }, token: null }),
  redefinirSenha: (email: string, codigo: string, novaSenha: string) =>
    apiFetch<{ mensagem: string }>('/api/recuperacao/redefinir-senha', { method: 'POST', body: { email, codigo, novaSenha }, token: null }),
  conteudos: (query?: { tipo?: TipoConteudo; categoria?: string; tag?: string }) => apiFetch<Conteudo[]>('/api/conteudos', { query }),
  conteudo: (id: string) => apiFetch<Conteudo>(`/api/conteudos/${id}`),
  criarConteudo: (body: {
    titulo: string
    tituloEn?: string
    descricao?: string
    descricaoEn?: string
    tipo: TipoConteudo
    categoria: string
    tags?: string[]
    urlMidia?: string | null
    corpoTexto?: string | null
    corpoTextoEn?: string | null
    exclusivo?: boolean
  }) => apiFetch<Conteudo>('/api/conteudos', { method: 'POST', body }),
  aprovarConteudo: (id: string, aprovado: boolean) =>
    apiFetch<Conteudo>(`/api/conteudos/${id}/aprovar`, { method: 'PATCH', query: { aprovado } }),
  foruns: () => apiFetch<Forum[]>('/api/foruns'),
  criarForum: (body: { nome: string; descricao?: string; privado?: boolean; limiteUtilizadores?: number }) =>
    apiFetch<Forum>('/api/foruns', { method: 'POST', body }),
  topicos: (forumId: string) => apiFetch<Topico[]>(`/api/foruns/${forumId}/topicos`),
  criarTopico: (body: { forumId: string; titulo: string; conteudo: string }) => apiFetch<Topico>('/api/topicos', { method: 'POST', body }),
  topico: (id: string) => apiFetch<Topico>(`/api/topicos/${id}`),
  censurarTopico: (id: string, censurado: boolean) =>
    apiFetch<Topico>(`/api/topicos/${id}/censurar`, { method: 'PATCH', query: { censurado } }),
  comentarios: (topicoId: string) => apiFetch<Comentario[]>(`/api/topicos/${topicoId}/comentarios/arvore`),
  comentar: (topicoId: string, body: { texto: string; comentarioPaiId?: string | null }) =>
    apiFetch<Comentario>(`/api/topicos/${topicoId}/comentarios`, { method: 'POST', body }),
  votar: (body: { entidadeId: string; tipoEntidade: TipoEntidadeVoto; tipoVoto: TipoVoto }) =>
    apiFetch<{ entidadeId: string; tipoEntidade: TipoEntidadeVoto; votoAtual: TipoVoto | null; score: number }>('/api/votos', { method: 'POST', body }),
  addMembro: (forumId: string, body: { utilizadorId: string; papel: PapelForum }) =>
    apiFetch<void>(`/api/foruns/${forumId}/membros`, { method: 'POST', body }),
  removeMembro: (forumId: string, membroId: string) => apiFetch<void>(`/api/foruns/${forumId}/membros/${membroId}`, { method: 'DELETE' }),
  alterarFala: (forumId: string, membroId: string, body: { podeFalar: boolean; suspensoAte?: string }) =>
    apiFetch<void>(`/api/foruns/${forumId}/membros/${membroId}/fala`, { method: 'PATCH', body }),
  minhasSubscricoes: () => apiFetch<Subscricao[]>('/api/subscricoes/minhas'),
  subscrever: (body: { conteudoId?: string | null; forumId?: string | null }) => apiFetch<Subscricao>('/api/subscricoes', { method: 'POST', body }),
  criarSala: (body: { forumId: string; conteudoId?: string | null; limiteUtilizadores?: number; tempoLimiteMs: number; pontosBase: number }) =>
    apiFetch<SalaQuiz>('/api/quiz/salas', { method: 'POST', body }),
  salas: (query?: { forumId?: string; estado?: string }) => apiFetch<SalaQuiz[]>('/api/quiz/salas', { query }),
  adicionarPergunta: (salaId: string, body: { enunciado: string; alternativas: string[]; respostaCorreta: string; ordem: number }) =>
    apiFetch<PerguntaQuiz>(`/api/quiz/salas/${salaId}/perguntas`, { method: 'POST', body }),
  entrarSala: (salaId: string) => apiFetch<SalaQuiz>(`/api/quiz/salas/${salaId}/entrar`, { method: 'POST' }),
  iniciarSala: (salaId: string) => apiFetch<SalaQuiz>(`/api/quiz/salas/${salaId}/iniciar`, { method: 'POST' }),
  finalizarSala: (salaId: string) => apiFetch<SalaQuiz>(`/api/quiz/salas/${salaId}/finalizar`, { method: 'POST' }),
  perguntasSala: (salaId: string) => apiFetch<PerguntaQuiz[]>(`/api/quiz/salas/${salaId}/perguntas`),
  responderSala: (salaId: string, body: { perguntaId: string; resposta: string; tempoGastoMs: number }) =>
    apiFetch<ResultadoQuiz>(`/api/quiz/salas/${salaId}/responder`, { method: 'POST', body }),
  rankingSala: (salaId: string) => apiFetch<RankingQuiz[]>(`/api/quiz/salas/${salaId}/ranking`),
  rankingRegioes: () => apiFetch<RankingAgregado[]>('/api/rankings/regioes'),
  rankingInstituicoes: () => apiFetch<RankingAgregado[]>('/api/rankings/instituicoes'),
  recomendacoes: () => apiFetch<Recomendacao[]>('/api/recomendacoes'),
  usuario: (id: string) => apiFetch<Utilizador>(`/api/usuarios/${id}`),
  alterarRole: (id: string, role: Role) => apiFetch<Utilizador>(`/api/usuarios/${id}/role`, { method: 'PATCH', body: { role } }),
  listarUtilizadores: () => apiFetch<Utilizador[]>('/api/usuarios'),
  apagarForum: (id: string) => apiFetch<void>(`/api/foruns/${id}`, { method: 'DELETE' }),
  apagarTopico: (id: string) => apiFetch<void>(`/api/topicos/${id}`, { method: 'DELETE' }),
  apagarConteudo: (id: string) => apiFetch<void>(`/api/conteudos/${id}`, { method: 'DELETE' }),
  apagarSalaQuiz: (id: string) => apiFetch<void>(`/api/quiz/salas/${id}`, { method: 'DELETE' }),
  ocultarConteudo: (id: string, aprovado: boolean) =>
    apiFetch<Conteudo>(`/api/conteudos/${id}/aprovar`, { method: 'PATCH', query: { aprovado } }),
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Erro inesperado.'
}

export function contentTypeLabel(tipo: TipoConteudo) {
  return tipo === 'TEXTO' ? 'Artigo' : tipo === 'AUDIO' ? 'Podcast' : 'Video'
}
