package com.plataforma.conteudo.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.plataforma.common.exception.BusinessRuleException;
import com.plataforma.common.exception.ResourceNotFoundException;
import com.plataforma.common.exception.UnauthorizedActionException;
import com.plataforma.conteudo.dto.ConteudoRequest;
import com.plataforma.conteudo.dto.ConteudoResponse;
import com.plataforma.conteudo.entity.Conteudo;
import com.plataforma.conteudo.entity.TipoConteudo;
import com.plataforma.conteudo.repository.ConteudoRepository;
import com.plataforma.subscricao.repository.SubscricaoRepository;
import com.plataforma.usuario.entity.Role;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.repository.UtilizadorRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ConteudoServiceImpl implements ConteudoService {
    private final ConteudoRepository conteudoRepository;
    private final UtilizadorRepository utilizadorRepository;
    private final SubscricaoRepository subscricaoRepository;
    private final ObjectMapper objectMapper;

    public ConteudoServiceImpl(ConteudoRepository conteudoRepository, UtilizadorRepository utilizadorRepository,
                               SubscricaoRepository subscricaoRepository, ObjectMapper objectMapper) {
        this.conteudoRepository = conteudoRepository;
        this.utilizadorRepository = utilizadorRepository;
        this.subscricaoRepository = subscricaoRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public ConteudoResponse criar(ConteudoRequest request, UUID userId) {
        Utilizador autor = utilizadorRepository.findById(userId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado"));
        Conteudo conteudo = new Conteudo();
        conteudo.setTitulo(request.titulo());
        conteudo.setTituloEn(request.tituloEn());
        conteudo.setDescricao(request.descricao());
        conteudo.setDescricaoEn(request.descricaoEn());
        conteudo.setTipo(request.tipo());
        conteudo.setCategoria(request.categoria());
        conteudo.setTags(writeTags(request.tags() == null ? List.of() : request.tags()));
        conteudo.setUrlMidia(request.urlMidia());
        conteudo.setCorpoTexto(request.corpoTexto());
        conteudo.setCorpoTextoEn(request.corpoTextoEn());
        conteudo.setExclusivo(Boolean.TRUE.equals(request.exclusivo()));
        conteudo.setAutor(autor);
        conteudo.setApproved(autor.getRole() != Role.CRIADOR);
        return toResponse(conteudoRepository.save(conteudo));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConteudoResponse> explorar(TipoConteudo tipo, String categoria, String tag, UUID userId) {
        List<Conteudo> base = tipo == null
                ? conteudoRepository.findByApprovedTrueOrderByDataCriacaoDesc()
                : conteudoRepository.findByTipoAndApprovedTrueOrderByDataCriacaoDesc(tipo);
        return base.stream()
                .filter(c -> categoria == null || c.getCategoria().equalsIgnoreCase(categoria))
                .filter(c -> tag == null || readTags(c).stream().anyMatch(t -> t.equalsIgnoreCase(tag)))
                .filter(c -> podeLer(c, userId))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ConteudoResponse obter(String id, UUID userId) {
        Conteudo conteudo = getConteudo(id);
        if (!Boolean.TRUE.equals(conteudo.getApproved())) {
            throw new ResourceNotFoundException("Conteudo nao encontrado");
        }
        if (!podeLer(conteudo, userId)) {
            throw new UnauthorizedActionException("Conteudo exclusivo para subscritores");
        }
        return toResponse(conteudo);
    }

    @Override
    @Transactional
    public ConteudoResponse aprovar(String id, boolean aprovado) {
        Conteudo conteudo = getConteudo(id);
        conteudo.setApproved(aprovado);
        return toResponse(conteudoRepository.save(conteudo));
    }

    @Override
    @Transactional
    public void apagar(String id) {
        Conteudo conteudo = getConteudo(id);
        conteudoRepository.delete(conteudo);
    }

    private boolean podeLer(Conteudo conteudo, UUID userId) {
        if (!Boolean.TRUE.equals(conteudo.getExclusivo()) || isMaster()) return true;
        return userId != null && subscricaoRepository.existsByUtilizadorIdAndConteudoIdAndAtivoTrue(userId.toString(), conteudo.getId());
    }

    private boolean isMaster() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_MASTER"));
    }

    private Conteudo getConteudo(String id) {
        return conteudoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conteudo nao encontrado"));
    }

    private String writeTags(List<String> tags) {
        try {
            return objectMapper.writeValueAsString(tags);
        } catch (Exception ex) {
            throw new BusinessRuleException("Tags invalidas");
        }
    }

    private List<String> readTags(Conteudo conteudo) {
        try {
            return objectMapper.readValue(conteudo.getTags(), new TypeReference<>() {});
        } catch (Exception ex) {
            return List.of();
        }
    }

    private ConteudoResponse toResponse(Conteudo c) {
        return new ConteudoResponse(c.getId(), c.getTitulo(), c.getTituloEn(), c.getDescricao(), c.getDescricaoEn(),
                c.getTipo(), c.getCategoria(), readTags(c), c.getUrlMidia(), c.getCorpoTexto(), c.getCorpoTextoEn(),
                c.getApproved(), c.getExclusivo(),
                c.getAutor().getId(), c.getDataCriacao());
    }
}
