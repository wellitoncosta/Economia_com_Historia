package com.plataforma.notificacao.event;

import com.plataforma.notificacao.dto.NotificacaoResponse;
import com.plataforma.notificacao.entity.Notificacao;
import com.plataforma.notificacao.repository.NotificacaoRepository;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.repository.UtilizadorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class NotificacaoListener {
    private static final Logger log = LoggerFactory.getLogger(NotificacaoListener.class);

    private final NotificacaoRepository repository;
    private final UtilizadorRepository utilizadorRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificacaoListener(NotificacaoRepository repository, UtilizadorRepository utilizadorRepository,
                               SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.utilizadorRepository = utilizadorRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    @Async("notificacaoExecutor")
    public void processarEventoInteracao(NotificacaoEvent evento) {
        Utilizador destinatario = utilizadorRepository.findById(evento.donoOriginalId()).orElse(null);
        Utilizador remetente = utilizadorRepository.findById(evento.quemInteragiuId()).orElse(null);
        if (destinatario == null || remetente == null) {
            return;
        }
        Notificacao notificacao = new Notificacao();
        notificacao.setDestinatario(destinatario);
        notificacao.setRemetente(remetente);
        notificacao.setMensagem(evento.mensagemAlerta());
        notificacao.setEntidadeAlvoId(evento.alvoId());
        notificacao.setTipoEvento(evento.tipo());
        Notificacao saved = repository.save(notificacao);
        NotificacaoResponse payload = toResponse(saved);
        messagingTemplate.convertAndSendToUser(evento.donoOriginalId(), "/queue/notificacoes", payload);
        log.info("notification_pushed destinatarioId={} tipo={}", evento.donoOriginalId(), evento.tipo());
    }

    private NotificacaoResponse toResponse(Notificacao n) {
        return new NotificacaoResponse(n.getId(), n.getDestinatario().getId(), n.getRemetente().getId(),
                n.getTipoEvento(), n.getMensagem(), n.getEntidadeAlvoId(), n.getLida(), n.getDataCriacao());
    }
}
