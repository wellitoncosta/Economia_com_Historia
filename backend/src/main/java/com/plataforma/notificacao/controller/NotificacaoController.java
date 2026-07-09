package com.plataforma.notificacao.controller;

import com.plataforma.notificacao.dto.NotificacaoResponse;
import com.plataforma.notificacao.service.NotificacaoService;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/notificacoes", produces = MediaType.APPLICATION_JSON_VALUE)
public class NotificacaoController {
    private final NotificacaoService service;

    public NotificacaoController(NotificacaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<NotificacaoResponse> minhas(@AuthenticationPrincipal UUID userId) {
        return service.minhas(userId);
    }

    @PatchMapping("/{id}/lida")
    public NotificacaoResponse marcarLida(@PathVariable String id, @AuthenticationPrincipal UUID userId) {
        return service.marcarLida(id, userId);
    }
}
