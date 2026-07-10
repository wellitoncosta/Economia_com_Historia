package com.plataforma.subscricao.service;

import com.plataforma.subscricao.dto.SubscricaoRequest;
import com.plataforma.subscricao.dto.SubscricaoResponse;

import java.util.List;
import java.util.UUID;

public interface SubscricaoService {
    SubscricaoResponse criar(SubscricaoRequest request, UUID userId);
    void cancelar(String id, UUID userId);
    List<SubscricaoResponse> minhas(UUID userId);
}
