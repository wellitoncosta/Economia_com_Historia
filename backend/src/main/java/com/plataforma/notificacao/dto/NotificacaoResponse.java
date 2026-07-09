package com.plataforma.notificacao.dto;

import java.time.LocalDateTime;

public record NotificacaoResponse(String id, String destinatarioId, String remetenteId, String tipoEvento,
                                  String mensagem, String entidadeAlvoId, Boolean lida, LocalDateTime dataCriacao) {
}
