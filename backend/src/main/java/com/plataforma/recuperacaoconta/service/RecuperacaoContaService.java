package com.plataforma.recuperacaoconta.service;

import com.plataforma.recuperacaoconta.dto.RecuperacaoResponse;
import com.plataforma.recuperacaoconta.dto.RedefinirSenhaRequest;
import com.plataforma.recuperacaoconta.dto.SolicitarRecuperacaoRequest;
import com.plataforma.recuperacaoconta.dto.ValidarOtpRequest;

public interface RecuperacaoContaService {
    RecuperacaoResponse solicitar(SolicitarRecuperacaoRequest request);
    RecuperacaoResponse validar(ValidarOtpRequest request);
    RecuperacaoResponse redefinirSenha(RedefinirSenhaRequest request);
}
