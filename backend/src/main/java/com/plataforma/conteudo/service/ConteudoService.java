package com.plataforma.conteudo.service;

import com.plataforma.conteudo.dto.ConteudoRequest;
import com.plataforma.conteudo.dto.ConteudoResponse;
import com.plataforma.conteudo.entity.TipoConteudo;

import java.util.List;
import java.util.UUID;

public interface ConteudoService {
    ConteudoResponse criar(ConteudoRequest request, UUID userId);
    List<ConteudoResponse> explorar(TipoConteudo tipo, String categoria, String tag, UUID userId);
    ConteudoResponse obter(String id, UUID userId);
    ConteudoResponse aprovar(String id, boolean aprovado);
    void apagar(String id, UUID userId);
}
