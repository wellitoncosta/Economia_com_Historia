package com.plataforma.topico.repository;

import com.plataforma.topico.entity.Topico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicoRepository extends JpaRepository<Topico, String> {
    List<Topico> findByForumIdOrderByDataCriacaoDesc(String forumId);
}
