package com.plataforma.usuario.repository;

import com.plataforma.usuario.entity.Utilizador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilizadorRepository extends JpaRepository<Utilizador, String> {
    Optional<Utilizador> findByEmail(String email);
    boolean existsByEmail(String email);
}
