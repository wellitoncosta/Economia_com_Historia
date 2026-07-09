package com.plataforma.recuperacaoconta.service;

import com.plataforma.common.exception.InvalidOtpException;
import com.plataforma.recuperacaoconta.dto.ValidarOtpRequest;
import com.plataforma.recuperacaoconta.entity.CodigoRecuperacao;
import com.plataforma.recuperacaoconta.repository.CodigoRecuperacaoRepository;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.repository.UtilizadorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecuperacaoContaServiceImplTest {
    @Mock CodigoRecuperacaoRepository codigoRepository;
    @Mock UtilizadorRepository utilizadorRepository;
    @Mock JavaMailSender mailSender;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks RecuperacaoContaServiceImpl service;

    @Test
    void codigoExpiradoFicaPermanentementeInutilizavel() {
        CodigoRecuperacao codigo = new CodigoRecuperacao();
        codigo.setCodigo("123456");
        codigo.setUtilizador(new Utilizador());
        codigo.setDataExpiracao(LocalDateTime.now().minusSeconds(1));
        when(codigoRepository.findTopByUtilizadorEmailAndFoiUtilizadoFalseOrderByDataExpiracaoDesc("a@b.com"))
                .thenReturn(Optional.of(codigo));

        assertThatThrownBy(() -> service.validar(new ValidarOtpRequest("a@b.com", "123456")))
                .isInstanceOf(InvalidOtpException.class);

        verify(codigoRepository).save(codigo);
        org.assertj.core.api.Assertions.assertThat(codigo.getFoiUtilizado()).isTrue();
    }

    @Test
    void tresTentativasInvalidasInutilizamCodigo() {
        CodigoRecuperacao codigo = new CodigoRecuperacao();
        codigo.setCodigo("123456");
        codigo.setTentativas(2);
        codigo.setUtilizador(new Utilizador());
        codigo.setDataExpiracao(LocalDateTime.now().plusMinutes(5));
        when(codigoRepository.findTopByUtilizadorEmailAndFoiUtilizadoFalseOrderByDataExpiracaoDesc("a@b.com"))
                .thenReturn(Optional.of(codigo));

        assertThatThrownBy(() -> service.validar(new ValidarOtpRequest("a@b.com", "000000")))
                .isInstanceOf(InvalidOtpException.class);

        org.assertj.core.api.Assertions.assertThat(codigo.getTentativas()).isEqualTo(3);
        org.assertj.core.api.Assertions.assertThat(codigo.getFoiUtilizado()).isTrue();
    }
}
