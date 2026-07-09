package com.plataforma.notificacao.service;

import com.plataforma.notificacao.dto.NotificacaoResponse;

import java.util.List;
import java.util.UUID;

public interface NotificacaoService {
    List<NotificacaoResponse> minhas(UUID userId);
    NotificacaoResponse marcarLida(String id, UUID userId);
}
