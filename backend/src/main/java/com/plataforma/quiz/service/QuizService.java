package com.plataforma.quiz.service;

import com.plataforma.quiz.dto.PerguntaQuizPayload;
import com.plataforma.quiz.dto.PerguntaQuizRequest;
import com.plataforma.quiz.dto.RankingSalaResponse;
import com.plataforma.quiz.dto.RespostaQuizPayload;
import com.plataforma.quiz.dto.ResultadoRespostaPayload;
import com.plataforma.quiz.dto.SalaQuizRequest;
import com.plataforma.quiz.dto.SalaQuizResponse;

import java.util.List;
import java.util.UUID;

public interface QuizService {
    List<SalaQuizResponse> listarSalas();
    SalaQuizResponse criarSala(SalaQuizRequest request, UUID userId);
    PerguntaQuizPayload adicionarPergunta(String salaId, PerguntaQuizRequest request, UUID userId);
    SalaQuizResponse entrar(String salaId, UUID userId);
    SalaQuizResponse iniciar(String salaId, UUID userId);
    SalaQuizResponse finalizar(String salaId, UUID userId);
    ResultadoRespostaPayload responder(String salaId, RespostaQuizPayload payload, UUID userId);
    List<PerguntaQuizPayload> perguntasPublicas(String salaId);
    List<RankingSalaResponse> ranking(String salaId);
    void apagarSala(String id);
}
