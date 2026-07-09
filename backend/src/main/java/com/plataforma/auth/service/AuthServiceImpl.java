package com.plataforma.auth.service;

import com.plataforma.auth.dto.AuthResponse;
import com.plataforma.auth.dto.LoginRequest;
import com.plataforma.auth.dto.RegisterRequest;
import com.plataforma.common.exception.BusinessRuleException;
import com.plataforma.common.exception.ResourceNotFoundException;
import com.plataforma.config.JwtService;
import com.plataforma.usuario.dto.UtilizadorResponse;
import com.plataforma.usuario.entity.Role;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.mapper.UtilizadorMapper;
import com.plataforma.usuario.repository.UtilizadorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UtilizadorRepository utilizadorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UtilizadorRepository utilizadorRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.utilizadorRepository = utilizadorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (utilizadorRepository.existsByEmail(request.email())) {
            throw new BusinessRuleException("Email ja registado");
        }
        Utilizador utilizador = new Utilizador();
        utilizador.setEmail(request.email().trim().toLowerCase());
        utilizador.setPasswordHash(passwordEncoder.encode(request.password()));
        utilizador.setRole(Role.INSCRITO);
        utilizador.setRegiao(request.regiao());
        utilizador.setInstituicao(request.instituicao());
        Utilizador saved = utilizadorRepository.save(utilizador);
        log.info("auth_register userId={} role={}", saved.getId(), saved.getRole());
        return response(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Utilizador utilizador = utilizadorRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new BusinessRuleException("Credenciais invalidas"));
        if (!passwordEncoder.matches(request.password(), utilizador.getPasswordHash())) {
            log.warn("auth_login_failed email={}", request.email());
            throw new BusinessRuleException("Credenciais invalidas");
        }
        log.info("auth_login userId={}", utilizador.getId());
        return response(utilizador);
    }

    @Override
    @Transactional(readOnly = true)
    public UtilizadorResponse me(UUID userId) {
        Utilizador utilizador = utilizadorRepository.findById(userId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado"));
        return UtilizadorMapper.toResponse(utilizador);
    }

    private AuthResponse response(Utilizador utilizador) {
        return new AuthResponse(jwtService.generateToken(utilizador), UtilizadorMapper.toResponse(utilizador));
    }
}
