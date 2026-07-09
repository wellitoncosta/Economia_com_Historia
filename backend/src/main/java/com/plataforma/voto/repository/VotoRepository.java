package com.plataforma.voto.repository;

import com.plataforma.voto.entity.TipoEntidadeVoto;
import com.plataforma.voto.entity.TipoVoto;
import com.plataforma.voto.entity.Voto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VotoRepository extends JpaRepository<Voto, String> {
    Optional<Voto> findByUtilizadorIdAndEntidadeIdAndTipoEntidade(String utilizadorId, String entidadeId, TipoEntidadeVoto tipoEntidade);
    long countByEntidadeIdAndTipoEntidadeAndTipoVoto(String entidadeId, TipoEntidadeVoto tipoEntidade, TipoVoto tipoVoto);
}
