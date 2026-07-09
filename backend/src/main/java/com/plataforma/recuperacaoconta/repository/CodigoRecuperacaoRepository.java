package com.plataforma.recuperacaoconta.repository;

import com.plataforma.recuperacaoconta.entity.CodigoRecuperacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CodigoRecuperacaoRepository extends JpaRepository<CodigoRecuperacao, String> {
    Optional<CodigoRecuperacao> findTopByUtilizadorEmailAndFoiUtilizadoFalseOrderByDataExpiracaoDesc(String email);
}
