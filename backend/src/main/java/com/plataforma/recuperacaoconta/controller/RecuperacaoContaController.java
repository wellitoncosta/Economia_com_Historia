package com.plataforma.recuperacaoconta.controller;

import com.plataforma.recuperacaoconta.dto.RecuperacaoResponse;
import com.plataforma.recuperacaoconta.dto.RedefinirSenhaRequest;
import com.plataforma.recuperacaoconta.dto.SolicitarRecuperacaoRequest;
import com.plataforma.recuperacaoconta.dto.ValidarOtpRequest;
import com.plataforma.recuperacaoconta.service.RecuperacaoContaService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/recuperacao", produces = MediaType.APPLICATION_JSON_VALUE)
public class RecuperacaoContaController {
    private final RecuperacaoContaService service;

    public RecuperacaoContaController(RecuperacaoContaService service) {
        this.service = service;
    }

    @PostMapping(value = "/solicitar", consumes = MediaType.APPLICATION_JSON_VALUE)
    public RecuperacaoResponse solicitar(@Valid @RequestBody SolicitarRecuperacaoRequest request) {
        return service.solicitar(request);
    }

    @PostMapping(value = "/validar", consumes = MediaType.APPLICATION_JSON_VALUE)
    public RecuperacaoResponse validar(@Valid @RequestBody ValidarOtpRequest request) {
        return service.validar(request);
    }

    @PostMapping(value = "/redefinir-senha", consumes = MediaType.APPLICATION_JSON_VALUE)
    public RecuperacaoResponse redefinirSenha(@Valid @RequestBody RedefinirSenhaRequest request) {
        return service.redefinirSenha(request);
    }
}
