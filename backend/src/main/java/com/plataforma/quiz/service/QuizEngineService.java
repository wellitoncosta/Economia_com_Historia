package com.plataforma.quiz.service;

import org.springframework.stereotype.Service;

@Service
public class QuizEngineService {
    public int calcularPontuacaoKahoot(long tempoCliqueMs, long tempoLimiteMs, int pontosBase) {
        if (tempoCliqueMs > tempoLimiteMs) {
            return 0;
        }
        double razaoTempo = (double) tempoCliqueMs / tempoLimiteMs;
        double penalidade = razaoTempo * 0.5;
        return (int) Math.round(pontosBase * (1.0 - penalidade));
    }
}
