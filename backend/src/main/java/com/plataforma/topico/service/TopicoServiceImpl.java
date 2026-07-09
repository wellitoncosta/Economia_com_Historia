package com.plataforma.topico.service;

import com.plataforma.common.exception.ResourceNotFoundException;
import com.plataforma.common.exception.UnauthorizedActionException;
import com.plataforma.forum.entity.Forum;
import com.plataforma.forum.repository.ForumRepository;
import com.plataforma.forum.service.ForumService;
import com.plataforma.topico.dto.TopicoRequest;
import com.plataforma.topico.dto.TopicoResponse;
import com.plataforma.topico.entity.Topico;
import com.plataforma.topico.repository.TopicoRepository;
import com.plataforma.usuario.entity.Role;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.repository.UtilizadorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TopicoServiceImpl implements TopicoService {
    private final TopicoRepository topicoRepository;
    private final ForumRepository forumRepository;
    private final UtilizadorRepository utilizadorRepository;
    private final ForumService forumService;

    public TopicoServiceImpl(TopicoRepository topicoRepository, ForumRepository forumRepository,
                             UtilizadorRepository utilizadorRepository, ForumService forumService) {
        this.topicoRepository = topicoRepository;
        this.forumRepository = forumRepository;
        this.utilizadorRepository = utilizadorRepository;
        this.forumService = forumService;
    }

    @Override
    @Transactional
    public TopicoResponse criar(TopicoRequest request, UUID userId) {
        if (!forumService.podeAcessar(request.forumId(), userId.toString())) {
            throw new UnauthorizedActionException("Sem acesso ao forum");
        }
        Forum forum = forumRepository.findById(request.forumId())
                .orElseThrow(() -> new ResourceNotFoundException("Forum nao encontrado"));
        Utilizador autor = utilizadorRepository.findById(userId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado"));
        Topico topico = new Topico();
        topico.setForum(forum);
        topico.setAutor(autor);
        topico.setTitulo(request.titulo());
        topico.setConteudo(request.conteudo());
        return toResponse(topicoRepository.save(topico));
    }

    @Override
    @Transactional(readOnly = true)
    public TopicoResponse obter(String id, UUID userId) {
        Topico topico = getTopico(id);
        if (!forumService.podeAcessar(topico.getForum().getId(), userId == null ? null : userId.toString())) {
            throw new UnauthorizedActionException("Sem acesso ao topico");
        }
        return toResponse(topico);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TopicoResponse> listarPorForum(String forumId, UUID userId) {
        if (!forumService.podeAcessar(forumId, userId == null ? null : userId.toString())) {
            throw new UnauthorizedActionException("Sem acesso ao forum");
        }
        return topicoRepository.findByForumIdOrderByDataCriacaoDesc(forumId).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public TopicoResponse censurar(String topicoId, boolean censurado, UUID userId) {
        if (userId == null) {
            throw new UnauthorizedActionException("Inicie sessao para moderar topicos");
        }
        Utilizador moderador = utilizadorRepository.findById(userId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado"));
        if (moderador.getRole() != Role.MASTER) {
            throw new UnauthorizedActionException("Apenas o Master pode censurar topicos");
        }
        Topico topico = getTopico(topicoId);
        topico.setCensurado(censurado);
        return toResponse(topicoRepository.save(topico));
    }

    @Override
    @Transactional
    public void atualizarScore(String topicoId, int score) {
        Topico topico = getTopico(topicoId);
        topico.setScore(score);
        topicoRepository.save(topico);
    }

    private Topico getTopico(String id) {
        return topicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topico nao encontrado"));
    }

    private TopicoResponse toResponse(Topico topico) {
        boolean censurado = Boolean.TRUE.equals(topico.getCensurado());
        return new TopicoResponse(topico.getId(), topico.getForum().getId(), topico.getAutor().getId(), topico.getAutor().getEmail(),
                topico.getTitulo(), censurado ? "Conteudo censurado pelo Master." : topico.getConteudo(), topico.getScore(),
                censurado, topico.getDataCriacao());
    }
}
