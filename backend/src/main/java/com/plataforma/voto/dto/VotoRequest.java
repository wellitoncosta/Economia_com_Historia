package com.plataforma.voto.dto;

import com.plataforma.voto.entity.TipoEntidadeVoto;
import com.plataforma.voto.entity.TipoVoto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VotoRequest(@NotBlank String entidadeId, @NotNull TipoEntidadeVoto tipoEntidade, @NotNull TipoVoto tipoVoto) {
}
