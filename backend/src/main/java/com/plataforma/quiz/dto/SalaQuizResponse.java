package com.plataforma.quiz.dto;

import com.plataforma.quiz.entity.EstadoSalaQuiz;

public record SalaQuizResponse(String id, String forumId, String conteudoId, Integer limiteUtilizadores,
                               Long tempoLimiteMs, Integer pontosBase, EstadoSalaQuiz estado) {
}
