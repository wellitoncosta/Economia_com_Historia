package com.plataforma.quiz.entity;

import com.plataforma.usuario.entity.Utilizador;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "respostas_quiz")
public class RespostaQuiz {
    @Id
    private String id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sala_id")
    private SalaQuiz sala;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pergunta_id")
    private PerguntaQuiz pergunta;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilizador_id")
    private Utilizador utilizador;
    @Column(name = "resposta_enviada", nullable = false)
    private String respostaEnviada;
    @Column(name = "tempo_gasto_ms", nullable = false)
    private Long tempoGastoMs;
    @Column(name = "pontuacao_calculada", nullable = false)
    private Integer pontuacaoCalculada;
    private Boolean correta;
    @Column(name = "data_resposta", nullable = false)
    private LocalDateTime dataResposta;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (dataResposta == null) dataResposta = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public SalaQuiz getSala() { return sala; }
    public void setSala(SalaQuiz sala) { this.sala = sala; }
    public PerguntaQuiz getPergunta() { return pergunta; }
    public void setPergunta(PerguntaQuiz pergunta) { this.pergunta = pergunta; }
    public Utilizador getUtilizador() { return utilizador; }
    public void setUtilizador(Utilizador utilizador) { this.utilizador = utilizador; }
    public String getRespostaEnviada() { return respostaEnviada; }
    public void setRespostaEnviada(String respostaEnviada) { this.respostaEnviada = respostaEnviada; }
    public Long getTempoGastoMs() { return tempoGastoMs; }
    public void setTempoGastoMs(Long tempoGastoMs) { this.tempoGastoMs = tempoGastoMs; }
    public Integer getPontuacaoCalculada() { return pontuacaoCalculada; }
    public void setPontuacaoCalculada(Integer pontuacaoCalculada) { this.pontuacaoCalculada = pontuacaoCalculada; }
    public Boolean getCorreta() { return correta; }
    public void setCorreta(Boolean correta) { this.correta = correta; }
    public LocalDateTime getDataResposta() { return dataResposta; }
    public void setDataResposta(LocalDateTime dataResposta) { this.dataResposta = dataResposta; }
}
