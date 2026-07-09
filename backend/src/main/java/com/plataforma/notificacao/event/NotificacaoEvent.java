package com.plataforma.notificacao.event;

public record NotificacaoEvent(String donoOriginalId, String quemInteragiuId, String mensagemAlerta,
                               String alvoId, String tipo) {
}
