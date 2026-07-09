package com.plataforma.conteudo.dto;

import com.plataforma.conteudo.entity.TipoConteudo;

import java.time.LocalDateTime;
import java.util.List;

public record ConteudoResponse(String id, String titulo, String tituloEn, String descricao, String descricaoEn,
                               TipoConteudo tipo, String categoria, List<String> tags, String urlMidia,
                               String corpoTexto, String corpoTextoEn, Boolean approved,
                               Boolean exclusivo, String autorId, LocalDateTime dataCriacao) {
}
