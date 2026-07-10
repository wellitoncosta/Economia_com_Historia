export type Role = 'VISITANTE' | 'INSCRITO' | 'CRIADOR' | 'REVISOR' | 'MASTER'

export type TipoConteudo = 'TEXTO' | 'VIDEO' | 'AUDIO'
export type PapelForum = 'DONO' | 'MODERADOR' | 'MEMBRO'
export type EstadoSalaQuiz = 'AGUARDANDO' | 'EM_ANDAMENTO' | 'FINALIZADA'
export type TipoEntidadeVoto = 'TOPICO' | 'COMENTARIO'
export type TipoVoto = 'UP' | 'DOWN'

export interface ApiErrorResponse {
  codigo: string
  mensagem: string
  timestamp?: string
  path?: string
  detalhes?: string[]
}

export interface Utilizador {
  id: string
  email: string
  role: Role
  pontosAcumulados: number
  regiao?: string | null
  instituicao?: string | null
}

export interface AuthResponse {
  token: string
  utilizador: Utilizador
}

export interface Conteudo {
  id: string
  titulo: string
  tituloEn?: string | null
  descricao?: string | null
  descricaoEn?: string | null
  tipo: TipoConteudo
  categoria: string
  tags?: string[]
  urlMidia?: string | null
  corpoTexto?: string | null
  corpoTextoEn?: string | null
  approved: boolean
  exclusivo?: boolean
  autorId: string
  dataCriacao: string
}

export interface Forum {
  id: string
  donoId: string
  nome: string
  descricao?: string | null
  privado?: boolean
  oculto?: boolean
  limiteUtilizadores?: number | null
  dataCriacao: string
}

export interface Topico {
  id: string
  forumId: string
  autorId: string
  autorNome?: string | null
  titulo: string
  conteudo: string
  score: number
  censurado?: boolean
  dataCriacao: string
}

export interface Comentario {
  id: string
  topicoId: string
  autorId: string
  autorNome?: string | null
  comentarioPaiId?: string | null
  texto: string
  score: number
  dataCriacao: string
  respostas: Comentario[]
}

export interface Subscricao {
  id: string
  conteudoId?: string | null
  forumId?: string | null
  ativo: boolean
  dataInicio: string
  dataFim?: string | null
}

export interface SalaQuiz {
  id: string
  titulo: string
  forumId: string
  conteudoId?: string | null
  limiteUtilizadores?: number | null
  tempoLimiteMs: number
  pontosBase: number
  estado: EstadoSalaQuiz
  criadorId?: string | null
  criadorEmail?: string | null
  oculto?: boolean
}

export interface PerguntaQuiz {
  id: string
  salaId: string
  enunciado: string
  alternativas: string[]
  ordem: number
  tempoLimiteMs: number
}

export interface ResultadoQuiz {
  perguntaId: string
  correta: boolean
  pontos: number
  pontuacaoAcumulada: number
}

export interface RankingQuiz {
  utilizadorId: string
  pontuacao: number
}

export interface RankingAgregado {
  chave: string
  pontos: number
}

export interface Recomendacao {
  conteudo: Conteudo
  motivo: string
}
