package com.plataforma.forum.dto;

import com.plataforma.forum.entity.PapelForum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdicionarMembroRequest(@NotBlank String utilizadorId, @NotNull PapelForum papel) {
}
