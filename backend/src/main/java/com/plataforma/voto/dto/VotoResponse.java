package com.plataforma.voto.dto;

import com.plataforma.voto.entity.TipoEntidadeVoto;
import com.plataforma.voto.entity.TipoVoto;

public record VotoResponse(String entidadeId, TipoEntidadeVoto tipoEntidade, TipoVoto votoAtual, Integer score) {
}
