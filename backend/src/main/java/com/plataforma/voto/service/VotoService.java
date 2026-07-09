package com.plataforma.voto.service;

import com.plataforma.voto.dto.VotoRequest;
import com.plataforma.voto.dto.VotoResponse;

import java.util.UUID;

public interface VotoService {
    VotoResponse votar(VotoRequest request, UUID userId);
}
