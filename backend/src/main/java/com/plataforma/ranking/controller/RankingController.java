package com.plataforma.ranking.controller;

import com.plataforma.ranking.dto.RankingResponse;
import com.plataforma.ranking.service.RankingService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/rankings", produces = MediaType.APPLICATION_JSON_VALUE)
public class RankingController {
    private final RankingService service;

    public RankingController(RankingService service) {
        this.service = service;
    }

    @GetMapping("/regioes")
    public List<RankingResponse> regioes() {
        return service.porRegiao();
    }

    @GetMapping("/instituicoes")
    public List<RankingResponse> instituicoes() {
        return service.porInstituicao();
    }
}
