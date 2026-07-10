package com.plataforma.usuario.service;

import com.plataforma.common.exception.ResourceNotFoundException;
import com.plataforma.usuario.dto.AlterarRoleRequest;
import com.plataforma.usuario.dto.UtilizadorResponse;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.mapper.UtilizadorMapper;
import com.plataforma.usuario.repository.UtilizadorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UtilizadorServiceImpl implements UtilizadorService {
    private final UtilizadorRepository repository;

    public UtilizadorServiceImpl(UtilizadorRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UtilizadorResponse> listar() {
        return repository.findAll().stream()
                .map(UtilizadorMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UtilizadorResponse obter(String id) {
        return UtilizadorMapper.toResponse(findById(id));
    }

    @Override
    @Transactional
    public UtilizadorResponse alterarRole(String id, AlterarRoleRequest request) {
        Utilizador utilizador = findById(id);
        utilizador.setRole(request.role());
        return UtilizadorMapper.toResponse(repository.save(utilizador));
    }

    private Utilizador findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado"));
    }
}
