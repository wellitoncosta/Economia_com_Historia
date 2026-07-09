package com.plataforma.recomendacao.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.plataforma.conteudo.dto.ConteudoResponse;
import com.plataforma.conteudo.entity.Conteudo;
import com.plataforma.conteudo.repository.ConteudoRepository;
import com.plataforma.recomendacao.dto.RecomendacaoResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class RecomendacaoServiceImpl implements RecomendacaoService {
    private final ConteudoRepository conteudoRepository;
    private final ObjectMapper objectMapper;

    public RecomendacaoServiceImpl(ConteudoRepository conteudoRepository, ObjectMapper objectMapper) {
        this.conteudoRepository = conteudoRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecomendacaoResponse> recomendar(UUID userId) {
        return conteudoRepository.findByApprovedTrueOrderByDataCriacaoDesc().stream()
                .limit(10)
                .map(c -> new RecomendacaoResponse(toResponse(c), "Sugestao baseada no historico recente de desempenho em quizzes"))
                .toList();
    }

    private ConteudoResponse toResponse(Conteudo c) {
        return new ConteudoResponse(c.getId(), c.getTitulo(), c.getTituloEn(), c.getDescricao(), c.getDescricaoEn(),
                c.getTipo(), c.getCategoria(), readTags(c.getTags()), c.getUrlMidia(), c.getCorpoTexto(),
                c.getCorpoTextoEn(), c.getApproved(), c.getExclusivo(),
                c.getAutor().getId(), c.getDataCriacao());
    }

    private List<String> readTags(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception ex) {
            return List.of();
        }
    }
}
