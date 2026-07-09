package com.plataforma.quiz.dto;

import java.util.List;

public record PerguntaQuizPayload(String id, String salaId, String enunciado, List<String> alternativas,
                                  Integer ordem, Long tempoLimiteMs) {
}
