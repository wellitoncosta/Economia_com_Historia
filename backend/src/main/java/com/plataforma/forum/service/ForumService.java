package com.plataforma.forum.service;

import com.plataforma.forum.dto.AdicionarMembroRequest;
import com.plataforma.forum.dto.ForumRequest;
import com.plataforma.forum.dto.ForumResponse;
import com.plataforma.forum.dto.PermissaoFalaRequest;

import java.util.List;
import java.util.UUID;

public interface ForumService {
    ForumResponse criar(ForumRequest request, UUID userId);
    List<ForumResponse> listar(UUID userId);
    ForumResponse obter(String id, UUID userId);
    void apagar(String id, UUID userId);
    void adicionarMembro(String forumId, AdicionarMembroRequest request, UUID userId);
    void removerMembro(String forumId, String membroId, UUID userId);
    void alterarPermissaoFala(String forumId, String membroId, PermissaoFalaRequest request, UUID userId);
    boolean podeAcessar(String forumId, String userId);
    boolean isModerador(String forumId, String userId);
}
