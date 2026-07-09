package com.plataforma.comentario.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ComentarioResponse(String id, String topicoId, String autorId, String autorNome, String comentarioPaiId,
                                 String texto, Integer score, LocalDateTime dataCriacao,
                                 List<ComentarioResponse> respostas) {
}
