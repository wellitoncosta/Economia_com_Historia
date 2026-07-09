package com.plataforma.recuperacaoconta.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SolicitarRecuperacaoRequest(@Email @NotBlank String email) {
}
