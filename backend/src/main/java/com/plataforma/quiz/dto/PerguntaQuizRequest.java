package com.plataforma.quiz.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PerguntaQuizRequest(@NotBlank String enunciado, @NotEmpty List<String> alternativas,
                                  @NotBlank String respostaCorreta, @NotNull Integer ordem) {
}
