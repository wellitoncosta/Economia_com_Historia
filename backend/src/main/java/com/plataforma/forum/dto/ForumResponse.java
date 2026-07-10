package com.plataforma.forum.dto;

import java.time.LocalDateTime;

public record ForumResponse(
        String id,
        String donoId,
        String nome,
        String descricao,
        Boolean privado,
        Boolean oculto,
        Integer limiteUtilizadores,
        LocalDateTime dataCriacao
) {
}
