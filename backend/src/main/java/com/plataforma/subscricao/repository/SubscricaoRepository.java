package com.plataforma.subscricao.repository;

import com.plataforma.subscricao.entity.Subscricao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscricaoRepository extends JpaRepository<Subscricao, String> {
    boolean existsByUtilizadorIdAndConteudoIdAndAtivoTrue(String utilizadorId, String conteudoId);
    boolean existsByUtilizadorIdAndForumIdAndAtivoTrue(String utilizadorId, String forumId);
    List<Subscricao> findByUtilizadorIdAndAtivoTrue(String utilizadorId);
}
