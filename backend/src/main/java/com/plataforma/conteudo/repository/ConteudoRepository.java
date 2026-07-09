package com.plataforma.conteudo.repository;

import com.plataforma.conteudo.entity.Conteudo;
import com.plataforma.conteudo.entity.TipoConteudo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConteudoRepository extends JpaRepository<Conteudo, String> {
    List<Conteudo> findByApprovedTrueOrderByDataCriacaoDesc();
    List<Conteudo> findByTipoAndApprovedTrueOrderByDataCriacaoDesc(TipoConteudo tipo);
}
