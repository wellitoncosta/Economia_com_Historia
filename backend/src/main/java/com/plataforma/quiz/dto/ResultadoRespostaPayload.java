package com.plataforma.quiz.dto;

public record ResultadoRespostaPayload(String perguntaId, boolean correta, int pontos, int pontuacaoAcumulada) {
}
