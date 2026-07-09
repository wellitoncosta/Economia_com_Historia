package com.plataforma.usuario.dto;

import com.plataforma.usuario.entity.Role;

public record UtilizadorResponse(
        String id,
        String email,
        Role role,
        Integer pontosAcumulados,
        String regiao,
        String instituicao
) {
}
