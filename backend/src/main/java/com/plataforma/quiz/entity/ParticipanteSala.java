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
@Table(name = "participantes_sala")
public class ParticipanteSala {
    @Id
    private String id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sala_id")
    private SalaQuiz sala;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilizador_id")
    private Utilizador utilizador;
    @Column(name = "pontuacao_acumulada")
    private Integer pontuacaoAcumulada = 0;
    private Boolean ativo = true;
    @Column(name = "data_entrada", nullable = false)
    private LocalDateTime dataEntrada;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (pontuacaoAcumulada == null) pontuacaoAcumulada = 0;
        if (ativo == null) ativo = true;
        if (dataEntrada == null) dataEntrada = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public SalaQuiz getSala() { return sala; }
    public void setSala(SalaQuiz sala) { this.sala = sala; }
    public Utilizador getUtilizador() { return utilizador; }
    public void setUtilizador(Utilizador utilizador) { this.utilizador = utilizador; }
    public Integer getPontuacaoAcumulada() { return pontuacaoAcumulada; }
    public void setPontuacaoAcumulada(Integer pontuacaoAcumulada) { this.pontuacaoAcumulada = pontuacaoAcumulada; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public LocalDateTime getDataEntrada() { return dataEntrada; }
    public void setDataEntrada(LocalDateTime dataEntrada) { this.dataEntrada = dataEntrada; }
}
