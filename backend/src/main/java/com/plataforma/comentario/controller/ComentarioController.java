package com.plataforma.comentario.controller;

import com.plataforma.comentario.dto.ComentarioRequest;
import com.plataforma.comentario.dto.ComentarioResponse;
import com.plataforma.comentario.service.ComentarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
public class ComentarioController {
    private final ComentarioService service;

    public ComentarioController(ComentarioService service) {
        this.service = service;
    }

    @PostMapping(value = "/api/topicos/{topicoId}/comentarios", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ComentarioResponse criar(@PathVariable String topicoId, @Valid @RequestBody ComentarioRequest request,
                                    @AuthenticationPrincipal UUID userId) {
        return service.criar(topicoId, request, userId);
    }

    @GetMapping(value = "/api/topicos/{topicoId}/comentarios/arvore", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ComentarioResponse> arvore(@PathVariable String topicoId, @AuthenticationPrincipal UUID userId) {
        return service.arvore(topicoId, userId);
    }

    @DeleteMapping("/api/comentarios/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagar(@PathVariable String id, @AuthenticationPrincipal UUID userId) {
        service.apagar(id, userId);
    }
}
