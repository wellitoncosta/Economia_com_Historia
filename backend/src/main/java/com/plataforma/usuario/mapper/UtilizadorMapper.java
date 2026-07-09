package com.plataforma.usuario.mapper;

import com.plataforma.usuario.dto.UtilizadorResponse;
import com.plataforma.usuario.entity.Utilizador;

public final class UtilizadorMapper {
    private UtilizadorMapper() {
    }

    public static UtilizadorResponse toResponse(Utilizador utilizador) {
        return new UtilizadorResponse(
                utilizador.getId(),
                utilizador.getEmail(),
                utilizador.getRole(),
                utilizador.getPontosAcumulados(),
                utilizador.getRegiao(),
                utilizador.getInstituicao()
        );
    }
}
