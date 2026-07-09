package com.plataforma.ranking.service;

import com.plataforma.ranking.dto.RankingResponse;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.repository.UtilizadorRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RankingServiceImpl implements RankingService {
    private final UtilizadorRepository repository;

    public RankingServiceImpl(UtilizadorRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable("rankingRegioes")
    public List<RankingResponse> porRegiao() {
        return agrupar(repository.findAll(), true);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable("rankingInstituicoes")
    public List<RankingResponse> porInstituicao() {
        return agrupar(repository.findAll(), false);
    }

    private List<RankingResponse> agrupar(List<Utilizador> utilizadores, boolean regiao) {
        Map<String, Integer> pontos = utilizadores.stream()
                .filter(u -> regiao ? u.getRegiao() != null : u.getInstituicao() != null)
                .collect(Collectors.groupingBy(
                        u -> regiao ? u.getRegiao() : u.getInstituicao(),
                        Collectors.summingInt(u -> u.getPontosAcumulados() == null ? 0 : u.getPontosAcumulados())
                ));
        return pontos.entrySet().stream()
                .map(e -> new RankingResponse(e.getKey(), e.getValue().longValue()))
                .sorted(Comparator.comparing(RankingResponse::pontos).reversed())
                .toList();
    }
}
