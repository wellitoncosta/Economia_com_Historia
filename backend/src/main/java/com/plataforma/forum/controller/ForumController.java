package com.plataforma.forum.controller;

import com.plataforma.forum.dto.AdicionarMembroRequest;
import com.plataforma.forum.dto.ForumRequest;
import com.plataforma.forum.dto.ForumResponse;
import com.plataforma.forum.dto.PermissaoFalaRequest;
import com.plataforma.forum.service.ForumService;
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
@RequestMapping(value = "/api/foruns", produces = MediaType.APPLICATION_JSON_VALUE)
public class ForumController {
    private final ForumService service;

    public ForumController(ForumService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('INSCRITO','CRIADOR','REVISOR','MASTER')")
    @ResponseStatus(HttpStatus.CREATED)
    public ForumResponse criar(@Valid @RequestBody ForumRequest request, @AuthenticationPrincipal UUID userId) {
        return service.criar(request, userId);
    }

    @GetMapping
    public List<ForumResponse> listar(@AuthenticationPrincipal UUID userId) {
        return service.listar(userId);
    }

    @GetMapping("/{id}")
    public ForumResponse obter(@PathVariable String id, @AuthenticationPrincipal UUID userId) {
        return service.obter(id, userId);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSCRITO','CRIADOR','REVISOR','MASTER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagar(@PathVariable String id, @AuthenticationPrincipal UUID userId) {
        service.apagar(id, userId);
    }

    @PatchMapping("/{id}/ocultar")
    @PreAuthorize("hasRole('MASTER')")
    public ForumResponse ocultar(@PathVariable String id,
                                 @RequestParam(defaultValue = "true") boolean oculto,
                                 @AuthenticationPrincipal UUID userId) {
        return service.ocultar(id, oculto, userId);
    }

    @PostMapping(value = "/{id}/membros", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void adicionarMembro(@PathVariable String id, @Valid @RequestBody AdicionarMembroRequest request,
                                @AuthenticationPrincipal UUID userId) {
        service.adicionarMembro(id, request, userId);
    }

    @DeleteMapping("/{id}/membros/{membroId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerMembro(@PathVariable String id, @PathVariable String membroId,
                              @AuthenticationPrincipal UUID userId) {
        service.removerMembro(id, membroId, userId);
    }

    @PatchMapping(value = "/{id}/membros/{membroId}/fala", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void alterarFala(@PathVariable String id, @PathVariable String membroId,
                            @Valid @RequestBody PermissaoFalaRequest request,
                            @AuthenticationPrincipal UUID userId) {
        service.alterarPermissaoFala(id, membroId, request, userId);
    }
}
