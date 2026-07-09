package com.plataforma.recomendacao.controller;

import com.plataforma.recomendacao.dto.RecomendacaoResponse;
import com.plataforma.recomendacao.service.RecomendacaoService;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/recomendacoes", produces = MediaType.APPLICATION_JSON_VALUE)
public class RecomendacaoController {
    private final RecomendacaoService service;

    public RecomendacaoController(RecomendacaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<RecomendacaoResponse> recomendar(@AuthenticationPrincipal UUID userId) {
        return service.recomendar(userId);
    }
}
