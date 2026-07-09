package com.plataforma.voto.entity;

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
@Table(name = "votos")
public class Voto {
    @Id
    private String id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilizador_id")
    private Utilizador utilizador;
    @Column(name = "entidade_id", nullable = false)
    private String entidadeId;
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_entidade", nullable = false)
    private TipoEntidadeVoto tipoEntidade;
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_voto", nullable = false)
    private TipoVoto tipoVoto;
    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (dataCriacao == null) dataCriacao = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Utilizador getUtilizador() { return utilizador; }
    public void setUtilizador(Utilizador utilizador) { this.utilizador = utilizador; }
    public String getEntidadeId() { return entidadeId; }
    public void setEntidadeId(String entidadeId) { this.entidadeId = entidadeId; }
    public TipoEntidadeVoto getTipoEntidade() { return tipoEntidade; }
    public void setTipoEntidade(TipoEntidadeVoto tipoEntidade) { this.tipoEntidade = tipoEntidade; }
    public TipoVoto getTipoVoto() { return tipoVoto; }
    public void setTipoVoto(TipoVoto tipoVoto) { this.tipoVoto = tipoVoto; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}
