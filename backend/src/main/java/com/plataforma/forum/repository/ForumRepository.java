package com.plataforma.forum.repository;

import com.plataforma.forum.entity.Forum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForumRepository extends JpaRepository<Forum, String> {
    List<Forum> findByPrivadoFalse();
}
