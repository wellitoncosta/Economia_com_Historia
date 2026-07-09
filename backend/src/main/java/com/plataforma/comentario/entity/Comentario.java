package com.plataforma.comentario.entity;

import com.plataforma.topico.entity.Topico;
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
@Table(name = "comentarios")
public class Comentario {
    @Id
    private String id;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topico_id")
    private Topico topico;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "autor_id")
    private Utilizador autor;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comentario_pai_id")
    private Comentario comentarioPai;
    private Integer score = 0;
    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (score == null) score = 0;
        if (dataCriacao == null) dataCriacao = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public Topico getTopico() { return topico; }
    public void setTopico(Topico topico) { this.topico = topico; }
    public Utilizador getAutor() { return autor; }
    public void setAutor(Utilizador autor) { this.autor = autor; }
    public Comentario getComentarioPai() { return comentarioPai; }
    public void setComentarioPai(Comentario comentarioPai) { this.comentarioPai = comentarioPai; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}
