package com.plataforma.topico.dto;

import java.time.LocalDateTime;

public record TopicoResponse(String id, String forumId, String autorId, String autorNome, String titulo, String conteudo,
                             Integer score, Boolean censurado, LocalDateTime dataCriacao) {
}
