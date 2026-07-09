package com.plataforma.topico.service;

import com.plataforma.topico.dto.TopicoRequest;
import com.plataforma.topico.dto.TopicoResponse;

import java.util.List;
import java.util.UUID;

public interface TopicoService {
    TopicoResponse criar(TopicoRequest request, UUID userId);
    TopicoResponse obter(String id, UUID userId);
    List<TopicoResponse> listarPorForum(String forumId, UUID userId);
    TopicoResponse censurar(String topicoId, boolean censurado, UUID userId);
    void atualizarScore(String topicoId, int score);
}
