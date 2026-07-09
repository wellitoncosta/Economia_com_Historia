package com.plataforma.comentario.dto;

import jakarta.validation.constraints.NotBlank;

public record ComentarioRequest(@NotBlank String texto, String comentarioPaiId) {
}
