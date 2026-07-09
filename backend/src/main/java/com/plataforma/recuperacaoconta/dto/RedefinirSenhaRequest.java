package com.plataforma.recuperacaoconta.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RedefinirSenhaRequest(
        @Email @NotBlank String email,
        @Pattern(regexp = "\\d{6}") String codigo,
        @NotBlank @Size(min = 8, max = 100) String novaSenha
) {
}
