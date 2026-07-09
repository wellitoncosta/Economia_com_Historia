package com.plataforma.usuario.dto;

import com.plataforma.usuario.entity.Role;
import jakarta.validation.constraints.NotNull;

public record AlterarRoleRequest(@NotNull Role role) {
}
