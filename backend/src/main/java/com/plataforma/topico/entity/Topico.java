package com.plataforma.topico.entity;

import com.plataforma.forum.entity.Forum;
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
@Table(name = "topicos")
public class Topico {
    @Id
    private String id;
    @Column(nullable = false)
    private String titulo;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "autor_id")
    private Utilizador autor;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "forum_id")
    private Forum forum;
    private Integer score = 0;
    @Column(name = "is_censurado")
    private Boolean censurado = false;
    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (score == null) score = 0;
        if (censurado == null) censurado = false;
        if (dataCriacao == null) dataCriacao = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }
    public Utilizador getAutor() { return autor; }
    public void setAutor(Utilizador autor) { this.autor = autor; }
    public Forum getForum() { return forum; }
    public void setForum(Forum forum) { this.forum = forum; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public Boolean getCensurado() { return censurado; }
    public void setCensurado(Boolean censurado) { this.censurado = censurado; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}
