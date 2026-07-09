package com.plataforma.notificacao.repository;

import com.plataforma.notificacao.entity.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacaoRepository extends JpaRepository<Notificacao, String> {
    List<Notificacao> findByDestinatarioIdOrderByDataCriacaoDesc(String destinatarioId);
}
