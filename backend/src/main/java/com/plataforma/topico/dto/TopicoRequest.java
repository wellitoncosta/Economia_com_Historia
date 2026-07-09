package com.plataforma.topico.dto;

import jakarta.validation.constraints.NotBlank;

public record TopicoRequest(@NotBlank String forumId, @NotBlank String titulo, @NotBlank String conteudo) {
}
