package com.plataforma.quiz.controller;

import com.plataforma.quiz.dto.PerguntaQuizPayload;
import com.plataforma.quiz.dto.PerguntaQuizRequest;
import com.plataforma.quiz.dto.RankingSalaResponse;
import com.plataforma.quiz.dto.RespostaQuizPayload;
import com.plataforma.quiz.dto.ResultadoRespostaPayload;
import com.plataforma.quiz.dto.SalaQuizRequest;
import com.plataforma.quiz.dto.SalaQuizResponse;
import com.plataforma.quiz.service.QuizService;
import jakarta.validation.Valid;
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
@RequestMapping(value = "/api/quiz/salas", produces = MediaType.APPLICATION_JSON_VALUE)
public class QuizController {
    private final QuizService service;

    public QuizController(QuizService service) {
        this.service = service;
    }

    @GetMapping
    public List<SalaQuizResponse> listar() {
        return service.listarSalas();
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public SalaQuizResponse criar(@Valid @RequestBody SalaQuizRequest request, @AuthenticationPrincipal UUID userId) {
        return service.criarSala(request, userId);
    }

    @PostMapping(value = "/{id}/perguntas", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public PerguntaQuizPayload adicionarPergunta(@PathVariable String id, @Valid @RequestBody PerguntaQuizRequest request,
                                                 @AuthenticationPrincipal UUID userId) {
        return service.adicionarPergunta(id, request, userId);
    }

    @PostMapping("/{id}/entrar")
    public SalaQuizResponse entrar(@PathVariable String id, @AuthenticationPrincipal UUID userId) {
        return service.entrar(id, userId);
    }

    @PostMapping("/{id}/iniciar")
    public SalaQuizResponse iniciar(@PathVariable String id, @AuthenticationPrincipal UUID userId) {
        return service.iniciar(id, userId);
    }

    @PostMapping("/{id}/finalizar")
    public SalaQuizResponse finalizar(@PathVariable String id, @AuthenticationPrincipal UUID userId) {
        return service.finalizar(id, userId);
    }

    @GetMapping("/{id}/perguntas")
    public List<PerguntaQuizPayload> perguntas(@PathVariable String id) {
        return service.perguntasPublicas(id);
    }

    @GetMapping("/{id}/ranking")
    public List<RankingSalaResponse> ranking(@PathVariable String id) {
        return service.ranking(id);
    }

    @PostMapping(value = "/{id}/responder", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResultadoRespostaPayload responder(@PathVariable String id, @Valid @RequestBody RespostaQuizPayload request,
                                              @AuthenticationPrincipal UUID userId) {
        return service.responder(id, request, userId);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MASTER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagarSala(@PathVariable String id) {
        service.apagarSala(id);
    }
}
