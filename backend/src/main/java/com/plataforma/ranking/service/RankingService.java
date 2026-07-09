package com.plataforma.ranking.service;

import com.plataforma.ranking.dto.RankingResponse;

import java.util.List;

public interface RankingService {
    List<RankingResponse> porRegiao();
    List<RankingResponse> porInstituicao();
}
