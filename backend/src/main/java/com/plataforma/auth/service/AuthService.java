package com.plataforma.auth.service;

import com.plataforma.auth.dto.AuthResponse;
import com.plataforma.auth.dto.LoginRequest;
import com.plataforma.auth.dto.RegisterRequest;
import com.plataforma.usuario.dto.UtilizadorResponse;

import java.util.UUID;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UtilizadorResponse me(UUID userId);
}
