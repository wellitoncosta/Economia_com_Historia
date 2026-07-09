package com.plataforma.recomendacao.service;

import com.plataforma.recomendacao.dto.RecomendacaoResponse;

import java.util.List;
import java.util.UUID;

public interface RecomendacaoService {
    List<RecomendacaoResponse> recomendar(UUID userId);
}
