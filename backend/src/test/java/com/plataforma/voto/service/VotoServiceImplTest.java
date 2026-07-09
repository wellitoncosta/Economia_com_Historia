package com.plataforma.voto.service;

import com.plataforma.comentario.repository.ComentarioRepository;
import com.plataforma.comentario.service.ComentarioService;
import com.plataforma.topico.repository.TopicoRepository;
import com.plataforma.topico.service.TopicoService;
import com.plataforma.usuario.entity.Utilizador;
import com.plataforma.usuario.repository.UtilizadorRepository;
import com.plataforma.voto.dto.VotoRequest;
import com.plataforma.voto.entity.TipoEntidadeVoto;
import com.plataforma.voto.entity.TipoVoto;
import com.plataforma.voto.entity.Voto;
import com.plataforma.voto.repository.VotoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VotoServiceImplTest {
    @Mock VotoRepository votoRepository;
    @Mock UtilizadorRepository utilizadorRepository;
    @Mock TopicoRepository topicoRepository;
    @Mock ComentarioRepository comentarioRepository;
    @Mock TopicoService topicoService;
    @Mock ComentarioService comentarioService;
    @InjectMocks VotoServiceImpl service;

    @Test
    void repetirMesmoVotoAnulaRegistroERecalculaScore() {
        UUID userId = UUID.randomUUID();
        String topicoId = UUID.randomUUID().toString();
        Voto voto = new Voto();
        voto.setTipoVoto(TipoVoto.UP);
        when(topicoRepository.existsById(topicoId)).thenReturn(true);
        when(utilizadorRepository.findById(userId.toString())).thenReturn(Optional.of(new Utilizador()));
        when(votoRepository.findByUtilizadorIdAndEntidadeIdAndTipoEntidade(userId.toString(), topicoId, TipoEntidadeVoto.TOPICO))
                .thenReturn(Optional.of(voto));

        var response = service.votar(new VotoRequest(topicoId, TipoEntidadeVoto.TOPICO, TipoVoto.UP), userId);

        assertThat(response.votoAtual()).isNull();
        verify(votoRepository).delete(voto);
        verify(topicoService).atualizarScore(topicoId, 0);
    }
}
