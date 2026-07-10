package com.plataforma.subscricao.controller;

import com.plataforma.subscricao.dto.SubscricaoRequest;
import com.plataforma.subscricao.dto.SubscricaoResponse;
import com.plataforma.subscricao.service.SubscricaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/subscricoes", produces = MediaType.APPLICATION_JSON_VALUE)
public class SubscricaoController {
    private final SubscricaoService service;

    public SubscricaoController(SubscricaoService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('INSCRITO','CRIADOR','REVISOR','MASTER')")
    @ResponseStatus(HttpStatus.CREATED)
    public SubscricaoResponse criar(@RequestBody SubscricaoRequest request, @AuthenticationPrincipal UUID userId) {
        return service.criar(request, userId);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSCRITO','CRIADOR','REVISOR','MASTER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelar(@PathVariable String id, @AuthenticationPrincipal UUID userId) {
        service.cancelar(id, userId);
    }

    @GetMapping("/minhas")
    public List<SubscricaoResponse> minhas(@AuthenticationPrincipal UUID userId) {
        return service.minhas(userId);
    }
}
