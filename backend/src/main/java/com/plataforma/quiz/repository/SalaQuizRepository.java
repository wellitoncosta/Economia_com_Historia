package com.plataforma.quiz.repository;

import com.plataforma.quiz.entity.SalaQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalaQuizRepository extends JpaRepository<SalaQuiz, String> {
}
