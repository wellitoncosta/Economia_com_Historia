package com.plataforma.recuperacaoconta.entity;

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
@Table(name = "codigos_recuperacao")
public class CodigoRecuperacao {
    @Id
    private String id;
    @Column(nullable = false, length = 6)
    private String codigo;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilizador_id")
    private Utilizador utilizador;
    @Column(name = "data_expiracao", nullable = false)
    private LocalDateTime dataExpiracao;
    @Column(name = "foi_utilizado")
    private Boolean foiUtilizado = false;
    private Integer tentativas = 0;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (foiUtilizado == null) foiUtilizado = false;
        if (tentativas == null) tentativas = 0;
    }

    public boolean expirado(LocalDateTime agora) {
        return !agora.isBefore(dataExpiracao);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public Utilizador getUtilizador() { return utilizador; }
    public void setUtilizador(Utilizador utilizador) { this.utilizador = utilizador; }
    public LocalDateTime getDataExpiracao() { return dataExpiracao; }
    public void setDataExpiracao(LocalDateTime dataExpiracao) { this.dataExpiracao = dataExpiracao; }
    public Boolean getFoiUtilizado() { return foiUtilizado; }
    public void setFoiUtilizado(Boolean foiUtilizado) { this.foiUtilizado = foiUtilizado; }
    public Integer getTentativas() { return tentativas; }
    public void setTentativas(Integer tentativas) { this.tentativas = tentativas; }
}
