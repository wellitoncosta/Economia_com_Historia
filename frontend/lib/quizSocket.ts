'use client'

import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { API_URL } from './api'
import { getStoredToken } from './auth'
import type { RankingQuiz, ResultadoQuiz } from './types'

export function createQuizClient(
  salaId: string,
  handlers: {
    onResult: (result: ResultadoQuiz) => void
    onRanking: (ranking: RankingQuiz[]) => void
    onError?: (message: string) => void
  }
) {
  const token = getStoredToken()
  const client = new Client({
    webSocketFactory: () => new SockJS(`${API_URL}/ws`),
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe('/user/queue/quiz/respostas', (message) => {
        handlers.onResult(JSON.parse(message.body) as ResultadoQuiz)
      })
      client.subscribe(`/topic/quiz/${salaId}/respostas`, (message) => {
        if (!token) handlers.onResult(JSON.parse(message.body) as ResultadoQuiz)
      })
      client.subscribe(`/topic/quiz/${salaId}/ranking`, (message) => {
        handlers.onRanking(JSON.parse(message.body) as RankingQuiz[])
      })
    },
    onStompError: (frame) => {
      handlers.onError?.(frame.headers.message || 'Erro na ligacao WebSocket.')
    },
  })

  return {
    connect: () => client.activate(),
    disconnect: () => client.deactivate(),
    answer: (payload: { perguntaId: string; resposta: string; tempoGastoMs: number }) => {
      client.publish({
        destination: `/app/quiz/${salaId}/responder`,
        body: JSON.stringify(payload),
      })
    },
  }
}
