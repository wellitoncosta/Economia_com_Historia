package com.plataforma.quiz.repository;

import com.plataforma.quiz.entity.SalaQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalaQuizRepository extends JpaRepository<SalaQuiz, String> {
    List<SalaQuiz> findByConteudoId(String conteudoId);
    List<SalaQuiz> findByForumId(String forumId);
}
