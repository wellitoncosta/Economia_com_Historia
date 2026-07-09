package com.plataforma.conteudo.entity;

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
@Table(name = "conteudos")
public class Conteudo {
    @Id
    private String id;
    @Column(nullable = false, length = 180)
    private String titulo;
    @Column(name = "titulo_en", length = 180)
    private String tituloEn;
    @Column(columnDefinition = "TEXT")
    private String descricao;
    @Column(name = "descricao_en", columnDefinition = "TEXT")
    private String descricaoEn;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoConteudo tipo;
    @Column(nullable = false, length = 100)
    private String categoria;
    @Column(nullable = false, columnDefinition = "JSON")
    private String tags;
    @Column(name = "url_midia", length = 500)
    private String urlMidia;
    @Column(name = "corpo_texto", columnDefinition = "TEXT")
    private String corpoTexto;
    @Column(name = "corpo_texto_en", columnDefinition = "TEXT")
    private String corpoTextoEn;
    @Column(name = "is_approved")
    private Boolean approved = true;
    @Column(name = "is_exclusivo")
    private Boolean exclusivo = false;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "autor_id")
    private Utilizador autor;
    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (approved == null) approved = true;
        if (exclusivo == null) exclusivo = false;
        if (dataCriacao == null) dataCriacao = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getTituloEn() { return tituloEn; }
    public void setTituloEn(String tituloEn) { this.tituloEn = tituloEn; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getDescricaoEn() { return descricaoEn; }
    public void setDescricaoEn(String descricaoEn) { this.descricaoEn = descricaoEn; }
    public TipoConteudo getTipo() { return tipo; }
    public void setTipo(TipoConteudo tipo) { this.tipo = tipo; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public String getUrlMidia() { return urlMidia; }
    public void setUrlMidia(String urlMidia) { this.urlMidia = urlMidia; }
    public String getCorpoTexto() { return corpoTexto; }
    public void setCorpoTexto(String corpoTexto) { this.corpoTexto = corpoTexto; }
    public String getCorpoTextoEn() { return corpoTextoEn; }
    public void setCorpoTextoEn(String corpoTextoEn) { this.corpoTextoEn = corpoTextoEn; }
    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }
    public Boolean getExclusivo() { return exclusivo; }
    public void setExclusivo(Boolean exclusivo) { this.exclusivo = exclusivo; }
    public Utilizador getAutor() { return autor; }
    public void setAutor(Utilizador autor) { this.autor = autor; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}
