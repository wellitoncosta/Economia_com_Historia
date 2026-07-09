package com.plataforma.forum.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ForumRequest(
        @NotBlank @Size(max = 120) String nome,
        String descricao,
        Boolean privado,
        @Min(1) Integer limiteUtilizadores
) {
}
