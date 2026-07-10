package com.plataforma.usuario.controller;

import com.plataforma.usuario.dto.AlterarRoleRequest;
import com.plataforma.usuario.dto.UtilizadorResponse;
import com.plataforma.usuario.service.UtilizadorService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/usuarios", produces = MediaType.APPLICATION_JSON_VALUE)
public class UtilizadorController {
    private final UtilizadorService service;

    public UtilizadorController(UtilizadorService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasRole('MASTER')")
    public List<UtilizadorResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public UtilizadorResponse obter(@PathVariable String id) {
        return service.obter(id);
    }

    @PatchMapping(value = "/{id}/role", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('MASTER')")
    public UtilizadorResponse alterarRole(@PathVariable String id, @Valid @RequestBody AlterarRoleRequest request) {
        return service.alterarRole(id, request);
    }
}
