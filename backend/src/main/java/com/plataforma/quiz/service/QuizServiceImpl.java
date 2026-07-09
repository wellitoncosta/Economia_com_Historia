package com.plataforma.quiz.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.plataforma.common.exception.BusinessRuleException;
import com.plataforma.common.exception.ResourceNotFoundException;
import com.plataforma.common.exception.UnauthorizedActionException;
import com.plataforma.conteudo.repository.ConteudoRepository;
import com.plataforma.forum.entity.Forum;
import com.plataforma.forum.repository.ForumRepository;
import com.plataforma.forum.service.ForumService;
import com.plataforma.quiz.dto.PerguntaQuizPayload;
import com.plataforma.quiz.dto.PerguntaQuizRequest;
import com.plataforma.quiz.dto.RankingSalaResponse;
import com.plataforma.quiz.dto.RespostaQuizPayload;
import com.plataforma.quiz.dto.ResultadoRespostaPayload;
import com.plataforma.quiz.dto.SalaQuizRequest;
import com.plataforma.quiz.dto.SalaQuizResponse;
import com.plataforma.quiz.entity.EstadoSalaQuiz;
import com.plataforma.quiz.entity.ParticipanteSala;
import com.plataforma.quiz.entity.PerguntaQuiz;
import com.plataforma.quiz.entity.RespostaQuiz;
import com.plataforma.quiz.entity.SalaQuiz;
import com.plataforma.quiz.repository.ParticipanteSalaRepository;
import com.plataforma.quiz.repository.PerguntaQuizRepository;
import com.plataforma.quiz.repository.RespostaQuizRepository;
import com.plataforma.quiz.repository.SalaQuizRepository;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.entity.Role;
import com.plataforma.usuario.repository.UtilizadorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class QuizServiceImpl implements QuizService {
    private static final Logger log = LoggerFactory.getLogger(QuizServiceImpl.class);
    private static final String GUEST_EMAIL = "visitante@local";

    private final SalaQuizRepository salaRepository;
    private final PerguntaQuizRepository perguntaRepository;
    private final ParticipanteSalaRepository participanteRepository;
    private final RespostaQuizRepository respostaRepository;
    private final ForumRepository forumRepository;
    private final ConteudoRepository conteudoRepository;
    private final UtilizadorRepository utilizadorRepository;
    private final ForumService forumService;
    private final QuizEngineService engineService;
    private final QuizSessionRegistry sessionRegistry;
    private final ObjectMapper objectMapper;

    public QuizServiceImpl(SalaQuizRepository salaRepository, PerguntaQuizRepository perguntaRepository,
                           ParticipanteSalaRepository participanteRepository, RespostaQuizRepository respostaRepository,
                           ForumRepository forumRepository, ConteudoRepository conteudoRepository,
                           UtilizadorRepository utilizadorRepository, ForumService forumService,
                           QuizEngineService engineService, QuizSessionRegistry sessionRegistry,
                           ObjectMapper objectMapper) {
        this.salaRepository = salaRepository;
        this.perguntaRepository = perguntaRepository;
        this.participanteRepository = participanteRepository;
        this.respostaRepository = respostaRepository;
        this.forumRepository = forumRepository;
        this.conteudoRepository = conteudoRepository;
        this.utilizadorRepository = utilizadorRepository;
        this.forumService = forumService;
        this.engineService = engineService;
        this.sessionRegistry = sessionRegistry;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalaQuizResponse> listarSalas() {
        return salaRepository.findAll().stream().map(this::toSalaResponse).toList();
    }

    @Override
    @Transactional
    public SalaQuizResponse criarSala(SalaQuizRequest request, UUID userId) {
        if (userId == null) {
            throw new UnauthorizedActionException("Inicie sessao para criar quizzes");
        }
        Forum forum = forumRepository.findById(request.forumId())
                .orElseThrow(() -> new ResourceNotFoundException("Forum nao encontrado"));
        SalaQuiz sala = new SalaQuiz();
        sala.setForum(forum);
        sala.setConteudo(request.conteudoId() == null ? null : conteudoRepository.findById(request.conteudoId())
                .orElseThrow(() -> new ResourceNotFoundException("Conteudo nao encontrado")));
        sala.setLimiteUtilizadores(request.limiteUtilizadores() == null ? Math.max(1, forum.getLimiteUtilizadores()) : request.limiteUtilizadores());
        sala.setTempoLimiteMs(request.tempoLimiteMs());
        sala.setPontosBase(request.pontosBase());
        return toSalaResponse(salaRepository.save(sala));
    }

    @Override
    @Transactional
    public PerguntaQuizPayload adicionarPergunta(String salaId, PerguntaQuizRequest request, UUID userId) {
        if (userId == null) {
            throw new UnauthorizedActionException("Inicie sessao para adicionar perguntas");
        }
        SalaQuiz sala = getSala(salaId);
        PerguntaQuiz pergunta = new PerguntaQuiz();
        pergunta.setSala(sala);
        pergunta.setConteudo(sala.getConteudo());
        pergunta.setEnunciado(request.enunciado());
        pergunta.setAlternativas(writeList(request.alternativas()));
        pergunta.setRespostaCorreta(request.respostaCorreta());
        pergunta.setOrdem(request.ordem());
        return toPublicPayload(perguntaRepository.save(pergunta));
    }

    @Override
    @Transactional
    public SalaQuizResponse entrar(String salaId, UUID userId) {
        SalaQuiz sala = getSala(salaId);
        Utilizador utilizador = userId == null ? getVisitante() : utilizadorRepository.findById(userId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado"));
        if (utilizador.getRole() == Role.VISITANTE) {
            log.info("quiz_guest_join salaId={}", salaId);
            return toSalaResponse(sala);
        }
        sessionRegistry.entrar(salaId, utilizador.getId(), sala.getLimiteUtilizadores());
        participanteRepository.findBySalaIdAndUtilizadorId(salaId, utilizador.getId()).ifPresentOrElse(participante -> {
            participante.setPontuacaoAcumulada(0);
            participanteRepository.save(participante);
            if (utilizador.getRole() != Role.VISITANTE) {
                respostaRepository.deleteBySalaIdAndUtilizadorId(salaId, utilizador.getId());
            }
        }, () -> {
            ParticipanteSala participante = new ParticipanteSala();
            participante.setSala(sala);
            participante.setUtilizador(utilizador);
            participanteRepository.save(participante);
        });
        log.info("quiz_join salaId={} userId={}", salaId, utilizador.getId());
        return toSalaResponse(sala);
    }

    @Override
    @Transactional
    public SalaQuizResponse iniciar(String salaId, UUID userId) {
        SalaQuiz sala = assertModeradorSala(salaId, userId);
        sala.setEstado(EstadoSalaQuiz.EM_ANDAMENTO);
        return toSalaResponse(salaRepository.save(sala));
    }

    @Override
    @Transactional
    public SalaQuizResponse finalizar(String salaId, UUID userId) {
        SalaQuiz sala = assertModeradorSala(salaId, userId);
        sala.setEstado(EstadoSalaQuiz.FINALIZADA);
        return toSalaResponse(salaRepository.save(sala));
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = {"rankingRegioes", "rankingInstituicoes"}, allEntries = true)
    public ResultadoRespostaPayload responder(String salaId, RespostaQuizPayload payload, UUID userId) {
        SalaQuiz sala = getSala(salaId);
        Utilizador utilizadorResposta = userId == null ? getVisitante() : utilizadorRepository.findById(userId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado"));
        boolean visitante = utilizadorResposta.getRole() == Role.VISITANTE;
        if (sala.getEstado() == EstadoSalaQuiz.AGUARDANDO || sala.getEstado() == EstadoSalaQuiz.FINALIZADA) {
            sala.setEstado(EstadoSalaQuiz.EM_ANDAMENTO);
            salaRepository.save(sala);
        }
        if (!visitante && respostaRepository.existsByPerguntaIdAndUtilizadorId(payload.perguntaId(), utilizadorResposta.getId())) {
            throw new BusinessRuleException("Pergunta ja respondida");
        }
        PerguntaQuiz pergunta = perguntaRepository.findById(payload.perguntaId())
                .orElseThrow(() -> new ResourceNotFoundException("Pergunta nao encontrada"));
        boolean correta = pergunta.getRespostaCorreta().equalsIgnoreCase(payload.resposta());
        int pontos = correta ? engineService.calcularPontuacaoKahoot(payload.tempoGastoMs(), sala.getTempoLimiteMs(), sala.getPontosBase()) : 0;
        if (visitante) {
            log.info("quiz_guest_answer salaId={} perguntaId={} correta={}", salaId, payload.perguntaId(), correta);
            return new ResultadoRespostaPayload(payload.perguntaId(), correta, pontos, pontos);
        }
        ParticipanteSala participante = participanteRepository.findBySalaIdAndUtilizadorId(salaId, utilizadorResposta.getId())
                .orElseGet(() -> {
                    ParticipanteSala novo = new ParticipanteSala();
                    novo.setSala(sala);
                    novo.setUtilizador(utilizadorResposta);
                    novo.setPontuacaoAcumulada(0);
                    return participanteRepository.save(novo);
                });
        participante.setPontuacaoAcumulada((participante.getPontuacaoAcumulada() == null ? 0 : participante.getPontuacaoAcumulada()) + pontos);
        participanteRepository.save(participante);
        Utilizador utilizador = participante.getUtilizador();
        utilizador.setPontosAcumulados((utilizador.getPontosAcumulados() == null ? 0 : utilizador.getPontosAcumulados()) + pontos);
        utilizadorRepository.save(utilizador);

        RespostaQuiz resposta = new RespostaQuiz();
        resposta.setSala(sala);
        resposta.setPergunta(pergunta);
        resposta.setUtilizador(participante.getUtilizador());
        resposta.setRespostaEnviada(payload.resposta());
        resposta.setTempoGastoMs(payload.tempoGastoMs());
        resposta.setPontuacaoCalculada(pontos);
        resposta.setCorreta(correta);
        respostaRepository.save(resposta);
        return new ResultadoRespostaPayload(payload.perguntaId(), correta, pontos, participante.getPontuacaoAcumulada());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerguntaQuizPayload> perguntasPublicas(String salaId) {
        return perguntaRepository.findBySalaIdOrderByOrdemAsc(salaId).stream().map(this::toPublicPayload).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RankingSalaResponse> ranking(String salaId) {
        return participanteRepository.findBySalaIdOrderByPontuacaoAcumuladaDesc(salaId).stream()
                .map(p -> new RankingSalaResponse(p.getUtilizador().getId(), p.getPontuacaoAcumulada()))
                .toList();
    }

    private SalaQuiz assertModeradorSala(String salaId, UUID userId) {
        SalaQuiz sala = getSala(salaId);
        if (userId == null) {
            throw new UnauthorizedActionException("Inicie sessao para controlar a sala");
        }
        return sala;
    }

    private Utilizador getVisitante() {
        return utilizadorRepository.findByEmail(GUEST_EMAIL).orElseGet(() -> {
            Utilizador visitante = new Utilizador();
            visitante.setEmail(GUEST_EMAIL);
            visitante.setPasswordHash("visitante-sem-login");
            visitante.setRole(Role.VISITANTE);
            visitante.setPontosAcumulados(0);
            return utilizadorRepository.save(visitante);
        });
    }

    private SalaQuiz getSala(String id) {
        return salaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Sala nao encontrada"));
    }

    private SalaQuizResponse toSalaResponse(SalaQuiz sala) {
        return new SalaQuizResponse(sala.getId(), sala.getForum().getId(),
                sala.getConteudo() == null ? null : sala.getConteudo().getId(),
                sala.getLimiteUtilizadores(), sala.getTempoLimiteMs(), sala.getPontosBase(), sala.getEstado());
    }

    private PerguntaQuizPayload toPublicPayload(PerguntaQuiz pergunta) {
        return new PerguntaQuizPayload(pergunta.getId(), pergunta.getSala().getId(), pergunta.getEnunciado(),
                readList(pergunta.getAlternativas()), pergunta.getOrdem(), pergunta.getSala().getTempoLimiteMs());
    }

    private String writeList(List<String> values) {
        try {
            return objectMapper.writeValueAsString(values);
        } catch (Exception ex) {
            throw new BusinessRuleException("Alternativas invalidas");
        }
    }

    private List<String> readList(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception ex) {
            return List.of();
        }
    }
}

