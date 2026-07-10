package com.plataforma.conteudo.controller;

import com.plataforma.conteudo.dto.ConteudoRequest;
import com.plataforma.conteudo.dto.ConteudoResponse;
import com.plataforma.conteudo.entity.TipoConteudo;
import com.plataforma.conteudo.service.ConteudoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping(value = "/api/conteudos", produces = MediaType.APPLICATION_JSON_VALUE)
public class ConteudoController {
    private final ConteudoService service;

    public ConteudoController(ConteudoService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('CRIADOR','REVISOR','MASTER')")
    @ResponseStatus(HttpStatus.CREATED)
    public ConteudoResponse criar(@Valid @RequestBody ConteudoRequest request, @AuthenticationPrincipal UUID userId) {
        return service.criar(request, userId);
    }

    @GetMapping
    public List<ConteudoResponse> explorar(@RequestParam(required = false) TipoConteudo tipo,
                                           @RequestParam(required = false) String categoria,
                                           @RequestParam(required = false) String tag,
                                           @AuthenticationPrincipal UUID userId) {
        return service.explorar(tipo, categoria, tag, userId);
    }

    @GetMapping("/{id}")
    public ConteudoResponse obter(@PathVariable String id, @AuthenticationPrincipal UUID userId) {
        return service.obter(id, userId);
    }

    @PatchMapping("/{id}/aprovar")
    @PreAuthorize("hasAnyRole('REVISOR','MASTER')")
    public ConteudoResponse aprovar(@PathVariable String id, @RequestParam(defaultValue = "true") boolean aprovado) {
        return service.aprovar(id, aprovado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MASTER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagar(@PathVariable String id) {
        service.apagar(id);
    }
}
