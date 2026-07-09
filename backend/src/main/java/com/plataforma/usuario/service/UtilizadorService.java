package com.plataforma.usuario.service;

import com.plataforma.usuario.dto.AlterarRoleRequest;
import com.plataforma.usuario.dto.UtilizadorResponse;

public interface UtilizadorService {
    UtilizadorResponse obter(String id);
    UtilizadorResponse alterarRole(String id, AlterarRoleRequest request);
}
