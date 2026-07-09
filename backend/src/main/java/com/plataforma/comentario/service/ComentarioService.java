package com.plataforma.comentario.service;

import com.plataforma.comentario.dto.ComentarioRequest;
import com.plataforma.comentario.dto.ComentarioResponse;

import java.util.List;
import java.util.UUID;

public interface ComentarioService {
    ComentarioResponse criar(String topicoId, ComentarioRequest request, UUID userId);
    List<ComentarioResponse> arvore(String topicoId, UUID userId);
    void apagar(String id, UUID userId);
    void atualizarScore(String comentarioId, int score);
}
