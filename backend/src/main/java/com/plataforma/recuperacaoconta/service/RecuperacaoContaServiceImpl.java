package com.plataforma.recuperacaoconta.service;

import com.plataforma.common.exception.InvalidOtpException;
import com.plataforma.common.exception.ResourceNotFoundException;
import com.plataforma.common.exception.BusinessRuleException;
import com.plataforma.recuperacaoconta.dto.RecuperacaoResponse;
import com.plataforma.recuperacaoconta.dto.RedefinirSenhaRequest;
import com.plataforma.recuperacaoconta.dto.SolicitarRecuperacaoRequest;
import com.plataforma.recuperacaoconta.dto.ValidarOtpRequest;
import com.plataforma.recuperacaoconta.entity.CodigoRecuperacao;
import com.plataforma.recuperacaoconta.repository.CodigoRecuperacaoRepository;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.repository.UtilizadorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class RecuperacaoContaServiceImpl implements RecuperacaoContaService {
    private static final Logger log = LoggerFactory.getLogger(RecuperacaoContaServiceImpl.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final CodigoRecuperacaoRepository codigoRepository;
    private final UtilizadorRepository utilizadorRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;
    private final String smtpUsername;

    public RecuperacaoContaServiceImpl(CodigoRecuperacaoRepository codigoRepository,
                                       UtilizadorRepository utilizadorRepository,
                                       JavaMailSender mailSender,
                                       PasswordEncoder passwordEncoder,
                                       @Value("${spring.mail.username:}") String smtpUsername) {
        this.codigoRepository = codigoRepository;
        this.utilizadorRepository = utilizadorRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
        this.smtpUsername = smtpUsername;
    }

    @Override
    @Transactional
    public RecuperacaoResponse solicitar(SolicitarRecuperacaoRequest request) {
        Utilizador utilizador = utilizadorRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado"));
        CodigoRecuperacao codigo = new CodigoRecuperacao();
        codigo.setUtilizador(utilizador);
        codigo.setCodigo(String.format("%06d", RANDOM.nextInt(1_000_000)));
        codigo.setDataExpiracao(LocalDateTime.now().plusMinutes(10));
        codigoRepository.save(codigo);
        if (smtpUsername == null || smtpUsername.isBlank()) {
            log.warn("otp_email_not_configured userId={}", utilizador.getId());
            throw new BusinessRuleException("Servico de email nao configurado. Configure SMTP_USERNAME e SMTP_PASSWORD.");
        }
        try {
            enviarEmail(utilizador.getEmail(), codigo.getCodigo());
        } catch (Exception ex) {
            log.warn("otp_email_failed userId={} errorType={} reason={}", utilizador.getId(),
                    ex.getClass().getSimpleName(), rootMessage(ex));
            throw new BusinessRuleException("Nao foi possivel enviar o email de recuperacao. Verifique a configuracao SMTP.");
        }
        log.info("otp_requested userId={}", utilizador.getId());
        return new RecuperacaoResponse("Codigo enviado por email");
    }

    @Override
    @Transactional
    public RecuperacaoResponse validar(ValidarOtpRequest request) {
        validarCodigo(request.email(), request.codigo(), false);
        return new RecuperacaoResponse("Codigo validado");
    }

    @Override
    @Transactional
    public RecuperacaoResponse redefinirSenha(RedefinirSenhaRequest request) {
        CodigoRecuperacao codigo = validarCodigo(request.email(), request.codigo(), true);
        Utilizador utilizador = codigo.getUtilizador();
        utilizador.setPasswordHash(passwordEncoder.encode(request.novaSenha()));
        utilizadorRepository.save(utilizador);
        codigo.setFoiUtilizado(true);
        codigoRepository.save(codigo);
        log.info("password_reset userId={}", utilizador.getId());
        return new RecuperacaoResponse("Senha redefinida");
    }

    private CodigoRecuperacao validarCodigo(String email, String valor, boolean consumirEmSucesso) {
        CodigoRecuperacao codigo = codigoRepository
                .findTopByUtilizadorEmailAndFoiUtilizadoFalseOrderByDataExpiracaoDesc(email.trim().toLowerCase())
                .orElseThrow(() -> new InvalidOtpException("Codigo invalido ou utilizado"));
        LocalDateTime agora = LocalDateTime.now();
        if (codigo.expirado(agora)) {
            codigo.setFoiUtilizado(true);
            codigoRepository.save(codigo);
            throw new InvalidOtpException("Codigo expirado");
        }
        if (!codigo.getCodigo().equals(valor)) {
            codigo.setTentativas(codigo.getTentativas() + 1);
            if (codigo.getTentativas() >= 3) {
                codigo.setFoiUtilizado(true);
            }
            codigoRepository.save(codigo);
            throw new InvalidOtpException("Codigo invalido");
        }
        if (consumirEmSucesso) {
            codigo.setFoiUtilizado(true);
        }
        return codigo;
    }

    private void enviarEmail(String email, String codigo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(smtpUsername.trim());
        message.setTo(email);
        message.setSubject("Codigo de recuperacao");
        message.setText("O seu codigo de recuperacao e: " + codigo + ". Expira em 10 minutos.");
        mailSender.send(message);
    }

    private String rootMessage(Throwable throwable) {
        Throwable current = throwable;
        while (current.getCause() != null) {
            current = current.getCause();
        }
        return current.getMessage();
    }
}
