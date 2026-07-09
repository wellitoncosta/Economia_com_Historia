package com.plataforma.conteudo.dto;

import com.plataforma.conteudo.entity.TipoConteudo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ConteudoRequest(
        @NotBlank String titulo,
        String tituloEn,
        String descricao,
        String descricaoEn,
        @NotNull TipoConteudo tipo,
        @NotBlank String categoria,
        List<String> tags,
        String urlMidia,
        String corpoTexto,
        String corpoTextoEn,
        Boolean exclusivo
) {
}
