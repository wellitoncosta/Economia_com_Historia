package com.plataforma.recomendacao.dto;

import com.plataforma.conteudo.dto.ConteudoResponse;

public record RecomendacaoResponse(ConteudoResponse conteudo, String motivo) {
}
