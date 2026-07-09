package com.plataforma.quiz.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RespostaQuizPayload(@NotBlank String perguntaId, @NotBlank String resposta,
                                  @NotNull Long tempoGastoMs) {
}
