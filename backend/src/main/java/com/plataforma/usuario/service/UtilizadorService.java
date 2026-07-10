package com.plataforma.usuario.service;

import com.plataforma.usuario.dto.AlterarRoleRequest;
import com.plataforma.usuario.dto.UtilizadorResponse;

import java.util.List;

public interface UtilizadorService {
    List<UtilizadorResponse> listar();
    UtilizadorResponse obter(String id);
    UtilizadorResponse alterarRole(String id, AlterarRoleRequest request);
}
