package com.plataforma.forum.repository;

import com.plataforma.forum.entity.MembroForum;
import com.plataforma.forum.entity.PapelForum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MembroForumRepository extends JpaRepository<MembroForum, String> {
    Optional<MembroForum> findByForumIdAndUtilizadorId(String forumId, String utilizadorId);
    boolean existsByForumIdAndUtilizadorId(String forumId, String utilizadorId);
    boolean existsByForumIdAndUtilizadorIdAndPapelIn(String forumId, String utilizadorId, Iterable<PapelForum> papeis);
}
