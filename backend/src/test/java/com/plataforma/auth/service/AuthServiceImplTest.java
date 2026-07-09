package com.plataforma.auth.service;

import com.plataforma.auth.dto.RegisterRequest;
import com.plataforma.config.JwtService;
import com.plataforma.usuario.entity.Role;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.repository.UtilizadorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {
    @Mock UtilizadorRepository utilizadorRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @InjectMocks AuthServiceImpl service;

    @Test
    void registoCriaUtilizadorInscritoComPasswordHashed() {
        when(passwordEncoder.encode("password123")).thenReturn("hash");
        when(jwtService.generateToken(any())).thenReturn("token");
        when(utilizadorRepository.save(any())).thenAnswer(invocation -> {
            Utilizador u = invocation.getArgument(0);
            u.setId("id-1");
            return u;
        });

        var response = service.register(new RegisterRequest("USER@EXAMPLE.COM", "password123", "Luanda", "ISPTEC"));

        assertThat(response.token()).isEqualTo("token");
        assertThat(response.utilizador().role()).isEqualTo(Role.INSCRITO);
        assertThat(response.utilizador().email()).isEqualTo("user@example.com");
    }
}
