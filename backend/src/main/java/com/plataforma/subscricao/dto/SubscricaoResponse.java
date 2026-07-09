package com.plataforma.subscricao.dto;

import java.time.LocalDateTime;

public record SubscricaoResponse(String id, String conteudoId, String forumId, Boolean ativo, LocalDateTime dataInicio) {
}
