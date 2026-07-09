package com.plataforma.quiz.service;

import com.plataforma.common.exception.RoomFullException;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class QuizSessionRegistry {
    private final ConcurrentHashMap<String, Set<String>> sessoesAtivas = new ConcurrentHashMap<>();

    public int entrar(String salaId, String utilizadorId, int limite) {
        Set<String> participantes = sessoesAtivas.computeIfAbsent(salaId, key -> ConcurrentHashMap.newKeySet());
        if (!participantes.contains(utilizadorId) && participantes.size() >= Math.max(1, limite)) {
            throw new RoomFullException("Sala cheia");
        }
        participantes.add(utilizadorId);
        return participantes.size();
    }

    public void sair(String salaId, String utilizadorId) {
        Set<String> participantes = sessoesAtivas.get(salaId);
        if (participantes != null) {
            participantes.remove(utilizadorId);
        }
    }
}
