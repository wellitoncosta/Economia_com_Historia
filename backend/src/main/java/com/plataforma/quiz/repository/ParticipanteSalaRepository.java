package com.plataforma.quiz.repository;

import com.plataforma.quiz.entity.ParticipanteSala;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipanteSalaRepository extends JpaRepository<ParticipanteSala, String> {
    long countBySalaIdAndAtivoTrue(String salaId);
    Optional<ParticipanteSala> findBySalaIdAndUtilizadorId(String salaId, String utilizadorId);
    List<ParticipanteSala> findBySalaIdOrderByPontuacaoAcumuladaDesc(String salaId);
}
