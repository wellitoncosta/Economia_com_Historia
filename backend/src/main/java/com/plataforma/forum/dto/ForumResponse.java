package com.plataforma.forum.dto;

import java.time.LocalDateTime;

public record ForumResponse(
        String id,
        String donoId,
        String nome,
        String descricao,
        Boolean privado,
        Integer limiteUtilizadores,
        LocalDateTime dataCriacao
) {
}
