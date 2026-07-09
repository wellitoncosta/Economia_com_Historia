package com.plataforma.quiz.repository;

import com.plataforma.quiz.entity.PerguntaQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerguntaQuizRepository extends JpaRepository<PerguntaQuiz, String> {
    List<PerguntaQuiz> findBySalaIdOrderByOrdemAsc(String salaId);
}
