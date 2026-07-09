package com.plataforma.auth.dto;

import com.plataforma.usuario.dto.UtilizadorResponse;

public record AuthResponse(String token, UtilizadorResponse utilizador) {
}
