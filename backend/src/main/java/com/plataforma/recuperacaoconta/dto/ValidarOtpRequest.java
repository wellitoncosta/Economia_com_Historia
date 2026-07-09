package com.plataforma.recuperacaoconta.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ValidarOtpRequest(@Email @NotBlank String email, @Pattern(regexp = "\\d{6}") String codigo) {
}
