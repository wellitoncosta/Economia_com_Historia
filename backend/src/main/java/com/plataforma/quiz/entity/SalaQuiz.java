package com.plataforma.quiz.entity;

import com.plataforma.conteudo.entity.Conteudo;
import com.plataforma.forum.entity.Forum;
import com.plataforma.usuario.entity.Utilizador;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "salas_quiz")
public class SalaQuiz {
    @Id
    private String id;
    @Column(nullable = false, length = 160)
    private String titulo;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "forum_id")
    private Forum forum;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conteudo_id")
    private Conteudo conteudo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criador_id")
    private Utilizador criador;
    @Column(name = "limite_utilizadores", nullable = false)
    private Integer limiteUtilizadores = 1;
    @Column(name = "tempo_limite_ms", nullable = false)
    private Long tempoLimiteMs;
    @Column(name = "pontos_base", nullable = false)
    private Integer pontosBase;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoSalaQuiz estado = EstadoSalaQuiz.AGUARDANDO;
    @Column(name = "is_oculto")
    private Boolean oculto = false;
    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (titulo == null || titulo.isBlank()) titulo = "Quiz";
        if (limiteUtilizadores == null || limiteUtilizadores < 1) limiteUtilizadores = 1;
        if (estado == null) estado = EstadoSalaQuiz.AGUARDANDO;
        if (oculto == null) oculto = false;
        if (dataCriacao == null) dataCriacao = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public Forum getForum() { return forum; }
    public void setForum(Forum forum) { this.forum = forum; }
    public Conteudo getConteudo() { return conteudo; }
    public void setConteudo(Conteudo conteudo) { this.conteudo = conteudo; }
    public Utilizador getCriador() { return criador; }
    public void setCriador(Utilizador criador) { this.criador = criador; }
    public Integer getLimiteUtilizadores() { return limiteUtilizadores; }
    public void setLimiteUtilizadores(Integer limiteUtilizadores) { this.limiteUtilizadores = limiteUtilizadores; }
    public Long getTempoLimiteMs() { return tempoLimiteMs; }
    public void setTempoLimiteMs(Long tempoLimiteMs) { this.tempoLimiteMs = tempoLimiteMs; }
    public Integer getPontosBase() { return pontosBase; }
    public void setPontosBase(Integer pontosBase) { this.pontosBase = pontosBase; }
    public EstadoSalaQuiz getEstado() { return estado; }
    public void setEstado(EstadoSalaQuiz estado) { this.estado = estado; }
    public Boolean getOculto() { return oculto; }
    public void setOculto(Boolean oculto) { this.oculto = oculto; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}
