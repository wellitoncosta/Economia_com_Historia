package com.plataforma.subscricao.service;

import com.plataforma.common.exception.BusinessRuleException;
import com.plataforma.common.exception.ResourceNotFoundException;
import com.plataforma.conteudo.repository.ConteudoRepository;
import com.plataforma.forum.repository.ForumRepository;
import com.plataforma.subscricao.dto.SubscricaoRequest;
import com.plataforma.subscricao.dto.SubscricaoResponse;
import com.plataforma.subscricao.entity.Subscricao;
import com.plataforma.subscricao.repository.SubscricaoRepository;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.repository.UtilizadorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SubscricaoServiceImpl implements SubscricaoService {
    private final SubscricaoRepository repository;
    private final UtilizadorRepository utilizadorRepository;
    private final ConteudoRepository conteudoRepository;
    private final ForumRepository forumRepository;

    public SubscricaoServiceImpl(SubscricaoRepository repository, UtilizadorRepository utilizadorRepository,
                                 ConteudoRepository conteudoRepository, ForumRepository forumRepository) {
        this.repository = repository;
        this.utilizadorRepository = utilizadorRepository;
        this.conteudoRepository = conteudoRepository;
        this.forumRepository = forumRepository;
    }

    @Override
    @Transactional
    public SubscricaoResponse criar(SubscricaoRequest request, UUID userId) {
        if ((request.conteudoId() == null && request.forumId() == null) ||
                (request.conteudoId() != null && request.forumId() != null)) {
            throw new BusinessRuleException("Informe conteudoId ou forumId, mas nao ambos");
        }
        Utilizador utilizador = utilizadorRepository.findById(userId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado"));
        Subscricao s = new Subscricao();
        s.setUtilizador(utilizador);
        if (request.conteudoId() != null) {
            s.setConteudo(conteudoRepository.findById(request.conteudoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Conteudo nao encontrado")));
        }
        if (request.forumId() != null) {
            s.setForum(forumRepository.findById(request.forumId())
                    .orElseThrow(() -> new ResourceNotFoundException("Forum nao encontrado")));
        }
        return toResponse(repository.save(s));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscricaoResponse> minhas(UUID userId) {
        return repository.findByUtilizadorIdAndAtivoTrue(userId.toString()).stream().map(this::toResponse).toList();
    }

    private SubscricaoResponse toResponse(Subscricao s) {
        return new SubscricaoResponse(s.getId(), s.getConteudo() == null ? null : s.getConteudo().getId(),
                s.getForum() == null ? null : s.getForum().getId(), s.getAtivo(), s.getDataInicio());
    }
}
