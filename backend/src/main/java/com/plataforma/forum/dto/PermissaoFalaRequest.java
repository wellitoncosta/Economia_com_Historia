package com.plataforma.forum.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record PermissaoFalaRequest(@NotNull Boolean podeFalar, LocalDateTime suspensoAte) {
}
