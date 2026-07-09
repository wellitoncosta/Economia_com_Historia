package com.plataforma.topico.controller;

import com.plataforma.topico.dto.TopicoRequest;
import com.plataforma.topico.dto.TopicoResponse;
import com.plataforma.topico.service.TopicoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class TopicoController {
    private final TopicoService service;

    public TopicoController(TopicoService service) {
        this.service = service;
    }

    @PostMapping(value = "/api/topicos", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('INSCRITO','CRIADOR','REVISOR','MASTER')")
    @ResponseStatus(HttpStatus.CREATED)
    public TopicoResponse criar(@Valid @RequestBody TopicoRequest request, @AuthenticationPrincipal UUID userId) {
        return service.criar(request, userId);
    }

    @GetMapping("/api/topicos/{id}")
    public TopicoResponse obter(@PathVariable String id, @AuthenticationPrincipal UUID userId) {
        return service.obter(id, userId);
    }

    @GetMapping("/api/foruns/{forumId}/topicos")
    public List<TopicoResponse> listar(@PathVariable String forumId, @AuthenticationPrincipal UUID userId) {
        return service.listarPorForum(forumId, userId);
    }

    @PatchMapping("/api/topicos/{id}/censurar")
    @PreAuthorize("hasRole('MASTER')")
    public TopicoResponse censurar(@PathVariable String id,
                                   @RequestParam(defaultValue = "true") boolean censurado,
                                   @AuthenticationPrincipal UUID userId) {
        return service.censurar(id, censurado, userId);
    }
}
