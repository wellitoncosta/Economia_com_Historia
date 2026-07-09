package com.plataforma.quiz.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class QuizEngineServiceTest {
    private final QuizEngineService service = new QuizEngineService();

    @Test
    void calculaPontuacaoComPenalidadeLinearAteCinquentaPorCento() {
        assertThat(service.calcularPontuacaoKahoot(0, 10_000, 1000)).isEqualTo(1000);
        assertThat(service.calcularPontuacaoKahoot(5_000, 10_000, 1000)).isEqualTo(750);
        assertThat(service.calcularPontuacaoKahoot(10_000, 10_000, 1000)).isEqualTo(500);
    }

    @Test
    void devolveZeroQuandoRespostaChegaDepoisDoLimite() {
        assertThat(service.calcularPontuacaoKahoot(10_001, 10_000, 1000)).isZero();
    }
}
