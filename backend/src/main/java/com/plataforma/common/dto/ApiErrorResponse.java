package com.plataforma.common.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ApiErrorResponse(
        String codigo,
        String mensagem,
        LocalDateTime timestamp,
        String path,
        List<String> detalhes
) {
}
