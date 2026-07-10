package com.plataforma.subscricao.repository;

import com.plataforma.subscricao.entity.Subscricao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscricaoRepository extends JpaRepository<Subscricao, String> {
    boolean existsByUtilizadorIdAndConteudoIdAndAtivoTrue(String utilizadorId, String conteudoId);
    boolean existsByUtilizadorIdAndForumIdAndAtivoTrue(String utilizadorId, String forumId);
    Optional<Subscricao> findFirstByUtilizadorIdAndConteudoId(String utilizadorId, String conteudoId);
    Optional<Subscricao> findFirstByUtilizadorIdAndForumId(String utilizadorId, String forumId);
    List<Subscricao> findByUtilizadorIdAndAtivoTrue(String utilizadorId);
    void deleteByConteudoId(String conteudoId);
    void deleteByForumId(String forumId);
}
