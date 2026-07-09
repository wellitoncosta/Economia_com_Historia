package com.plataforma.comentario.service;

import com.plataforma.comentario.dto.ComentarioRequest;
import com.plataforma.comentario.dto.ComentarioResponse;
import com.plataforma.comentario.entity.Comentario;
import com.plataforma.comentario.repository.ComentarioRepository;
import com.plataforma.common.exception.ResourceNotFoundException;
import com.plataforma.common.exception.UnauthorizedActionException;
import com.plataforma.forum.service.ForumService;
import com.plataforma.topico.entity.Topico;
import com.plataforma.topico.repository.TopicoRepository;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.entity.Role;
import com.plataforma.usuario.repository.UtilizadorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ComentarioServiceImpl implements ComentarioService {
    private static final String GUEST_EMAIL = "visitante@local";
    private final ComentarioRepository comentarioRepository;
    private final TopicoRepository topicoRepository;
    private final UtilizadorRepository utilizadorRepository;
    private final ForumService forumService;

    public ComentarioServiceImpl(ComentarioRepository comentarioRepository, TopicoRepository topicoRepository,
                                 UtilizadorRepository utilizadorRepository, ForumService forumService) {
        this.comentarioRepository = comentarioRepository;
        this.topicoRepository = topicoRepository;
        this.utilizadorRepository = utilizadorRepository;
        this.forumService = forumService;
    }

    @Override
    @Transactional
    public ComentarioResponse criar(String topicoId, ComentarioRequest request, UUID userId) {
        Topico topico = getTopico(topicoId);
        if (!forumService.podeAcessar(topico.getForum().getId(), userId == null ? null : userId.toString())) {
            throw new UnauthorizedActionException("Sem acesso ao topico");
        }
        Utilizador autor = userId == null ? getVisitante() : utilizadorRepository.findById(userId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado"));
        Comentario comentario = new Comentario();
        comentario.setTopico(topico);
        comentario.setAutor(autor);
        comentario.setTexto(request.texto());
        if (request.comentarioPaiId() != null) {
            Comentario pai = comentarioRepository.findById(request.comentarioPaiId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comentario pai nao encontrado"));
            comentario.setComentarioPai(pai);
        }
        return toResponse(comentarioRepository.save(comentario), List.of());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComentarioResponse> arvore(String topicoId, UUID userId) {
        Topico topico = getTopico(topicoId);
        if (!forumService.podeAcessar(topico.getForum().getId(), userId == null ? null : userId.toString())) {
            throw new UnauthorizedActionException("Sem acesso ao topico");
        }
        List<Comentario> comentarios = comentarioRepository.findByTopicoIdOrderByDataCriacaoAsc(topicoId);
        Map<String, List<Comentario>> filhos = new HashMap<>();
        List<Comentario> raizes = new ArrayList<>();
        for (Comentario comentario : comentarios) {
            if (comentario.getComentarioPai() == null) {
                raizes.add(comentario);
            } else {
                filhos.computeIfAbsent(comentario.getComentarioPai().getId(), k -> new ArrayList<>()).add(comentario);
            }
        }
        return raizes.stream().map(c -> build(c, filhos)).toList();
    }

    @Override
    @Transactional
    public void apagar(String id, UUID userId) {
        Comentario comentario = comentarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario nao encontrado"));
        boolean autor = comentario.getAutor().getId().equals(userId.toString());
        boolean moderador = forumService.isModerador(comentario.getTopico().getForum().getId(), userId.toString());
        if (!autor && !moderador) {
            throw new UnauthorizedActionException("Sem permissao para apagar comentario");
        }
        comentarioRepository.delete(comentario);
    }

    @Override
    @Transactional
    public void atualizarScore(String comentarioId, int score) {
        Comentario comentario = comentarioRepository.findById(comentarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario nao encontrado"));
        comentario.setScore(score);
        comentarioRepository.save(comentario);
    }

    private ComentarioResponse build(Comentario comentario, Map<String, List<Comentario>> filhos) {
        List<ComentarioResponse> respostas = filhos.getOrDefault(comentario.getId(), List.of()).stream()
                .map(c -> build(c, filhos))
                .toList();
        return toResponse(comentario, respostas);
    }

    private ComentarioResponse toResponse(Comentario comentario, List<ComentarioResponse> respostas) {
        String autorNome = comentario.getAutor().getRole() == Role.VISITANTE ? "Visitante" : comentario.getAutor().getEmail();
        return new ComentarioResponse(comentario.getId(), comentario.getTopico().getId(), comentario.getAutor().getId(), autorNome,
                comentario.getComentarioPai() == null ? null : comentario.getComentarioPai().getId(),
                comentario.getTexto(), comentario.getScore(), comentario.getDataCriacao(), respostas);
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

    private Topico getTopico(String id) {
        return topicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topico nao encontrado"));
    }
}
