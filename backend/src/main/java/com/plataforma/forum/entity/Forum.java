package com.plataforma.forum.entity;

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
@Table(name = "foruns")
public class Forum {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dono_id")
    private Utilizador dono;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "is_privado")
    private Boolean privado = false;

    @Column(name = "is_oculto")
    private Boolean oculto = false;

    @Column(name = "limite_utilizadores", nullable = false)
    private Integer limiteUtilizadores = 1;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (limiteUtilizadores == null || limiteUtilizadores < 1) limiteUtilizadores = 1;
        if (privado == null) privado = false;
        if (oculto == null) oculto = false;
        if (dataCriacao == null) dataCriacao = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Utilizador getDono() { return dono; }
    public void setDono(Utilizador dono) { this.dono = dono; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public Boolean getPrivado() { return privado; }
    public void setPrivado(Boolean privado) { this.privado = privado; }
    public Boolean getOculto() { return oculto; }
    public void setOculto(Boolean oculto) { this.oculto = oculto; }
    public Integer getLimiteUtilizadores() { return limiteUtilizadores; }
    public void setLimiteUtilizadores(Integer limiteUtilizadores) { this.limiteUtilizadores = limiteUtilizadores; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}
