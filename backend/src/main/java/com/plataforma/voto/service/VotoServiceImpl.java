package com.plataforma.voto.service;

import com.plataforma.comentario.repository.ComentarioRepository;
import com.plataforma.comentario.service.ComentarioService;
import com.plataforma.common.exception.ResourceNotFoundException;
import com.plataforma.topico.repository.TopicoRepository;
import com.plataforma.topico.service.TopicoService;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.repository.UtilizadorRepository;
import com.plataforma.voto.dto.VotoRequest;
import com.plataforma.voto.dto.VotoResponse;
import com.plataforma.voto.entity.TipoEntidadeVoto;
import com.plataforma.voto.entity.TipoVoto;
import com.plataforma.voto.entity.Voto;
import com.plataforma.voto.repository.VotoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class VotoServiceImpl implements VotoService {
    private final VotoRepository votoRepository;
    private final UtilizadorRepository utilizadorRepository;
    private final TopicoRepository topicoRepository;
    private final ComentarioRepository comentarioRepository;
    private final TopicoService topicoService;
    private final ComentarioService comentarioService;

    public VotoServiceImpl(VotoRepository votoRepository, UtilizadorRepository utilizadorRepository,
                           TopicoRepository topicoRepository, ComentarioRepository comentarioRepository,
                           TopicoService topicoService, ComentarioService comentarioService) {
        this.votoRepository = votoRepository;
        this.utilizadorRepository = utilizadorRepository;
        this.topicoRepository = topicoRepository;
        this.comentarioRepository = comentarioRepository;
        this.topicoService = topicoService;
        this.comentarioService = comentarioService;
    }

    @Override
    @Transactional
    public VotoResponse votar(VotoRequest request, UUID userId) {
        assertEntidadeExiste(request);
        Utilizador utilizador = utilizadorRepository.findById(userId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado"));
        Optional<Voto> existente = votoRepository.findByUtilizadorIdAndEntidadeIdAndTipoEntidade(
                userId.toString(), request.entidadeId(), request.tipoEntidade());
        TipoVoto votoAtual;
        if (existente.isPresent() && existente.get().getTipoVoto() == request.tipoVoto()) {
            votoRepository.delete(existente.get());
            votoAtual = null;
        } else {
            Voto voto = existente.orElseGet(Voto::new);
            voto.setUtilizador(utilizador);
            voto.setEntidadeId(request.entidadeId());
            voto.setTipoEntidade(request.tipoEntidade());
            voto.setTipoVoto(request.tipoVoto());
            votoRepository.save(voto);
            votoAtual = request.tipoVoto();
        }
        int score = recalcularScore(request.entidadeId(), request.tipoEntidade());
        return new VotoResponse(request.entidadeId(), request.tipoEntidade(), votoAtual, score);
    }

    private void assertEntidadeExiste(VotoRequest request) {
        if (request.tipoEntidade() == TipoEntidadeVoto.TOPICO && !topicoRepository.existsById(request.entidadeId())) {
            throw new ResourceNotFoundException("Topico nao encontrado");
        }
        if (request.tipoEntidade() == TipoEntidadeVoto.COMENTARIO && !comentarioRepository.existsById(request.entidadeId())) {
            throw new ResourceNotFoundException("Comentario nao encontrado");
        }
    }

    private int recalcularScore(String entidadeId, TipoEntidadeVoto tipoEntidade) {
        long ups = votoRepository.countByEntidadeIdAndTipoEntidadeAndTipoVoto(entidadeId, tipoEntidade, TipoVoto.UP);
        long downs = votoRepository.countByEntidadeIdAndTipoEntidadeAndTipoVoto(entidadeId, tipoEntidade, TipoVoto.DOWN);
        int score = Math.toIntExact(ups - downs);
        if (tipoEntidade == TipoEntidadeVoto.TOPICO) {
            topicoService.atualizarScore(entidadeId, score);
        } else {
            comentarioService.atualizarScore(entidadeId, score);
        }
        return score;
    }
}
