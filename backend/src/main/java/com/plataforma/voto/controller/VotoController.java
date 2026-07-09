package com.plataforma.voto.controller;

import com.plataforma.voto.dto.VotoRequest;
import com.plataforma.voto.dto.VotoResponse;
import com.plataforma.voto.service.VotoService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping(value = "/api/votos", produces = MediaType.APPLICATION_JSON_VALUE)
public class VotoController {
    private final VotoService service;

    public VotoController(VotoService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('INSCRITO','CRIADOR','REVISOR','MASTER')")
    public VotoResponse votar(@Valid @RequestBody VotoRequest request, @AuthenticationPrincipal UUID userId) {
        return service.votar(request, userId);
    }
}
