package com.plataforma.forum.entity;

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
@Table(name = "membros_forum")
public class MembroForum {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "forum_id")
    private Forum forum;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilizador_id")
    private Utilizador utilizador;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PapelForum papel;

    @Column(name = "pode_falar")
    private Boolean podeFalar = true;

    @Column(name = "suspenso_ate")
    private LocalDateTime suspensoAte;

    @Column(name = "data_entrada", nullable = false)
    private LocalDateTime dataEntrada;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (podeFalar == null) podeFalar = true;
        if (dataEntrada == null) dataEntrada = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Forum getForum() { return forum; }
    public void setForum(Forum forum) { this.forum = forum; }
    public Utilizador getUtilizador() { return utilizador; }
    public void setUtilizador(Utilizador utilizador) { this.utilizador = utilizador; }
    public PapelForum getPapel() { return papel; }
    public void setPapel(PapelForum papel) { this.papel = papel; }
    public Boolean getPodeFalar() { return podeFalar; }
    public void setPodeFalar(Boolean podeFalar) { this.podeFalar = podeFalar; }
    public LocalDateTime getSuspensoAte() { return suspensoAte; }
    public void setSuspensoAte(LocalDateTime suspensoAte) { this.suspensoAte = suspensoAte; }
    public LocalDateTime getDataEntrada() { return dataEntrada; }
    public void setDataEntrada(LocalDateTime dataEntrada) { this.dataEntrada = dataEntrada; }
}
