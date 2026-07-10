package com.plataforma.quiz.repository;

import com.plataforma.quiz.entity.RespostaQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RespostaQuizRepository extends JpaRepository<RespostaQuiz, String> {
    boolean existsByPerguntaIdAndUtilizadorId(String perguntaId, String utilizadorId);
    Optional<RespostaQuiz> findByPerguntaIdAndUtilizadorId(String perguntaId, String utilizadorId);
    void deleteBySalaIdAndUtilizadorId(String salaId, String utilizadorId);
    void deleteBySalaId(String salaId);
}
