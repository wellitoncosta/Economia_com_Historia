package com.plataforma.quiz.repository;

import com.plataforma.quiz.entity.RespostaQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RespostaQuizRepository extends JpaRepository<RespostaQuiz, String> {
    boolean existsByPerguntaIdAndUtilizadorId(String perguntaId, String utilizadorId);
    void deleteBySalaIdAndUtilizadorId(String salaId, String utilizadorId);
}
