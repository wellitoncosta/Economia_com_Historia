package com.plataforma.quiz.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SalaQuizRequest(
        @NotBlank String titulo,
        @NotBlank String forumId,
        String conteudoId,
        @Min(1) Integer limiteUtilizadores,
        @NotNull @Min(1000) Long tempoLimiteMs,
        @NotNull @Min(1) Integer pontosBase
) {
}
