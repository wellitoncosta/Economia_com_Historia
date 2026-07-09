package com.plataforma.notificacao.service;

import com.plataforma.common.exception.ResourceNotFoundException;
import com.plataforma.common.exception.UnauthorizedActionException;
import com.plataforma.notificacao.dto.NotificacaoResponse;
import com.plataforma.notificacao.entity.Notificacao;
import com.plataforma.notificacao.repository.NotificacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotificacaoServiceImpl implements NotificacaoService {
    private final NotificacaoRepository repository;

    public NotificacaoServiceImpl(NotificacaoRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificacaoResponse> minhas(UUID userId) {
        return repository.findByDestinatarioIdOrderByDataCriacaoDesc(userId.toString()).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public NotificacaoResponse marcarLida(String id, UUID userId) {
        Notificacao notificacao = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificacao nao encontrada"));
        if (!notificacao.getDestinatario().getId().equals(userId.toString())) {
            throw new UnauthorizedActionException("Notificacao pertence a outro utilizador");
        }
        notificacao.setLida(true);
        return toResponse(repository.save(notificacao));
    }

    private NotificacaoResponse toResponse(Notificacao n) {
        return new NotificacaoResponse(n.getId(), n.getDestinatario().getId(), n.getRemetente().getId(),
                n.getTipoEvento(), n.getMensagem(), n.getEntidadeAlvoId(), n.getLida(), n.getDataCriacao());
    }
}
