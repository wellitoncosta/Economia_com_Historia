package com.plataforma.quiz.entity;

import com.plataforma.conteudo.entity.Conteudo;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "perguntas_quiz")
public class PerguntaQuiz {
    @Id
    private String id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sala_id")
    private SalaQuiz sala;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conteudo_id")
    private Conteudo conteudo;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String enunciado;
    @Column(nullable = false, columnDefinition = "JSON")
    private String alternativas;
    @Column(name = "resposta_correta", nullable = false)
    private String respostaCorreta;
    @Column(nullable = false)
    private Integer ordem;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public SalaQuiz getSala() { return sala; }
    public void setSala(SalaQuiz sala) { this.sala = sala; }
    public Conteudo getConteudo() { return conteudo; }
    public void setConteudo(Conteudo conteudo) { this.conteudo = conteudo; }
    public String getEnunciado() { return enunciado; }
    public void setEnunciado(String enunciado) { this.enunciado = enunciado; }
    public String getAlternativas() { return alternativas; }
    public void setAlternativas(String alternativas) { this.alternativas = alternativas; }
    public String getRespostaCorreta() { return respostaCorreta; }
    public void setRespostaCorreta(String respostaCorreta) { this.respostaCorreta = respostaCorreta; }
    public Integer getOrdem() { return ordem; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }
}
