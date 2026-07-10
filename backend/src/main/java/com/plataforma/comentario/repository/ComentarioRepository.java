package com.plataforma.comentario.repository;

import com.plataforma.comentario.entity.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, String> {
    List<Comentario> findByTopicoIdOrderByDataCriacaoAsc(String topicoId);
    void deleteByTopicoId(String topicoId);
}
