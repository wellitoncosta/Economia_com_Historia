package com.plataforma.common.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public final class SecurityUtils {
    private SecurityUtils() {
    }

    public static UUID currentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalStateException("Utilizador nao autenticado");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UUID id) {
            return id;
        }
        return UUID.fromString(principal.toString());
    }
}
