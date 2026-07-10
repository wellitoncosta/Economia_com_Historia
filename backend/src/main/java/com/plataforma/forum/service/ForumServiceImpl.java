package com.plataforma.forum.service;

import com.plataforma.common.exception.BusinessRuleException;
import com.plataforma.common.exception.ResourceNotFoundException;
import com.plataforma.common.exception.UnauthorizedActionException;
import com.plataforma.forum.dto.AdicionarMembroRequest;
import com.plataforma.forum.dto.ForumRequest;
import com.plataforma.forum.dto.ForumResponse;
import com.plataforma.forum.dto.PermissaoFalaRequest;
import com.plataforma.forum.entity.Forum;
import com.plataforma.forum.entity.MembroForum;
import com.plataforma.forum.entity.PapelForum;
import com.plataforma.forum.repository.ForumRepository;
import com.plataforma.forum.repository.MembroForumRepository;
import com.plataforma.quiz.repository.ParticipanteSalaRepository;
import com.plataforma.quiz.repository.PerguntaQuizRepository;
import com.plataforma.quiz.repository.RespostaQuizRepository;
import com.plataforma.quiz.repository.SalaQuizRepository;
import com.plataforma.subscricao.repository.SubscricaoRepository;
import com.plataforma.comentario.repository.ComentarioRepository;
import com.plataforma.topico.repository.TopicoRepository;
import com.plataforma.usuario.entity.Role;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.repository.UtilizadorRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ForumServiceImpl implements ForumService {
    private final ForumRepository forumRepository;
    private final MembroForumRepository membroRepository;
    private final UtilizadorRepository utilizadorRepository;
    private final SalaQuizRepository salaQuizRepository;
    private final PerguntaQuizRepository perguntaQuizRepository;
    private final ParticipanteSalaRepository participanteSalaRepository;
    private final RespostaQuizRepository respostaQuizRepository;
    private final TopicoRepository topicoRepository;
    private final ComentarioRepository comentarioRepository;
    private final SubscricaoRepository subscricaoRepository;

    public ForumServiceImpl(ForumRepository forumRepository,
                            MembroForumRepository membroRepository,
                            UtilizadorRepository utilizadorRepository,
                            SalaQuizRepository salaQuizRepository,
                            PerguntaQuizRepository perguntaQuizRepository,
                            ParticipanteSalaRepository participanteSalaRepository,
                            RespostaQuizRepository respostaQuizRepository,
                            TopicoRepository topicoRepository,
                            ComentarioRepository comentarioRepository,
                            SubscricaoRepository subscricaoRepository) {
        this.forumRepository = forumRepository;
        this.membroRepository = membroRepository;
        this.utilizadorRepository = utilizadorRepository;
        this.salaQuizRepository = salaQuizRepository;
        this.perguntaQuizRepository = perguntaQuizRepository;
        this.participanteSalaRepository = participanteSalaRepository;
        this.respostaQuizRepository = respostaQuizRepository;
        this.topicoRepository = topicoRepository;
        this.comentarioRepository = comentarioRepository;
        this.subscricaoRepository = subscricaoRepository;
    }

    @Override
    @Transactional
    public ForumResponse criar(ForumRequest request, UUID userId) {
        Utilizador dono = utilizadorRepository.findById(userId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado"));
        Forum forum = new Forum();
        forum.setDono(dono);
        forum.setNome(request.nome());
        forum.setDescricao(request.descricao());
        forum.setPrivado(Boolean.TRUE.equals(request.privado()));
        forum.setLimiteUtilizadores(request.limiteUtilizadores() == null ? 1 : request.limiteUtilizadores());
        Forum saved = forumRepository.save(forum);

        MembroForum membro = new MembroForum();
        membro.setForum(saved);
        membro.setUtilizador(dono);
        membro.setPapel(PapelForum.DONO);
        membroRepository.save(membro);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ForumResponse> listar(UUID userId) {
        if (userId == null) {
            return forumRepository.findByPrivadoFalse().stream()
                    .filter(f -> !Boolean.TRUE.equals(f.getOculto()))
                    .map(this::toResponse)
                    .toList();
        }
        boolean master = isMaster();
        return forumRepository.findAll().stream()
                .filter(f -> master || !Boolean.TRUE.equals(f.getOculto()))
                .filter(f -> podeAcessarEntity(f, userId.toString()))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ForumResponse obter(String id, UUID userId) {
        Forum forum = getForum(id);
        if (Boolean.TRUE.equals(forum.getOculto()) && !isMaster() && (userId == null || !forum.getDono().getId().equals(userId.toString()))) {
            throw new ResourceNotFoundException("Forum nao encontrado");
        }
        if (!podeAcessarEntity(forum, userId == null ? null : userId.toString())) {
            throw new UnauthorizedActionException("Sem acesso ao forum privado");
        }
        return toResponse(forum);
    }

    @Override
    @Transactional
    public void apagar(String id, UUID userId) {
        Forum forum = getForum(id);
        if (userId == null || (!isMaster() && !forum.getDono().getId().equals(userId.toString()))) {
            throw new UnauthorizedActionException("Apenas o dono ou Master pode apagar o forum");
        }
        salaQuizRepository.findByForumId(id).forEach(sala -> {
            respostaQuizRepository.deleteBySalaId(sala.getId());
            participanteSalaRepository.deleteBySalaId(sala.getId());
            perguntaQuizRepository.deleteBySalaId(sala.getId());
            salaQuizRepository.delete(sala);
        });
        topicoRepository.findByForumIdOrderByDataCriacaoDesc(id).forEach(topico -> comentarioRepository.deleteByTopicoId(topico.getId()));
        topicoRepository.deleteByForumId(id);
        membroRepository.deleteByForumId(id);
        subscricaoRepository.deleteByForumId(id);
        forumRepository.delete(forum);
    }

    @Override
    @Transactional
    public ForumResponse ocultar(String id, boolean oculto, UUID userId) {
        Forum forum = getForum(id);
        forum.setOculto(oculto);
        return toResponse(forumRepository.save(forum));
    }

    @Override
    @Transactional
    public void adicionarMembro(String forumId, AdicionarMembroRequest request, UUID userId) {
        assertModerador(forumId, userId.toString());
        if (membroRepository.existsByForumIdAndUtilizadorId(forumId, request.utilizadorId())) {
            throw new BusinessRuleException("Utilizador ja e membro do forum");
        }
        Forum forum = getForum(forumId);
        Utilizador utilizador = utilizadorRepository.findById(request.utilizadorId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado"));
        MembroForum membro = new MembroForum();
        membro.setForum(forum);
        membro.setUtilizador(utilizador);
        membro.setPapel(request.papel());
        membroRepository.save(membro);
    }

    @Override
    @Transactional
    public void removerMembro(String forumId, String membroId, UUID userId) {
        assertModerador(forumId, userId.toString());
        MembroForum membro = membroRepository.findByForumIdAndUtilizadorId(forumId, membroId)
                .orElseThrow(() -> new ResourceNotFoundException("Membro nao encontrado"));
        membroRepository.delete(membro);
    }

    @Override
    @Transactional
    public void alterarPermissaoFala(String forumId, String membroId, PermissaoFalaRequest request, UUID userId) {
        assertModerador(forumId, userId.toString());
        MembroForum membro = membroRepository.findByForumIdAndUtilizadorId(forumId, membroId)
                .orElseThrow(() -> new ResourceNotFoundException("Membro nao encontrado"));
        membro.setPodeFalar(request.podeFalar());
        membro.setSuspensoAte(request.suspensoAte());
        membroRepository.save(membro);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean podeAcessar(String forumId, String userId) {
        return podeAcessarEntity(getForum(forumId), userId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isModerador(String forumId, String userId) {
        if (isMaster()) return true;
        return membroRepository.existsByForumIdAndUtilizadorIdAndPapelIn(
                forumId, userId, List.of(PapelForum.DONO, PapelForum.MODERADOR));
    }

    private void assertModerador(String forumId, String userId) {
        if (!isModerador(forumId, userId)) {
            throw new UnauthorizedActionException("Acao permitida apenas a moderadores");
        }
    }

    private boolean podeAcessarEntity(Forum forum, String userId) {
        if (!Boolean.TRUE.equals(forum.getPrivado()) || isMaster()) return true;
        return userId != null && membroRepository.existsByForumIdAndUtilizadorId(forum.getId(), userId);
    }

    private Forum getForum(String id) {
        return forumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Forum nao encontrado"));
    }

    private boolean isMaster() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + Role.MASTER.name()));
    }

    private ForumResponse toResponse(Forum forum) {
        return new ForumResponse(forum.getId(), forum.getDono().getId(), forum.getNome(), forum.getDescricao(),
                forum.getPrivado(), forum.getOculto(), forum.getLimiteUtilizadores(), forum.getDataCriacao());
    }
}
