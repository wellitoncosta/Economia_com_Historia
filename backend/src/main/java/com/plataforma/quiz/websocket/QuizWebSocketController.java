package com.plataforma.quiz.websocket;

import com.plataforma.quiz.dto.RespostaQuizPayload;
import com.plataforma.quiz.dto.ResultadoRespostaPayload;
import com.plataforma.quiz.service.QuizService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
public class QuizWebSocketController {
    private final QuizService quizService;
    private final SimpMessagingTemplate messagingTemplate;

    public QuizWebSocketController(QuizService quizService, SimpMessagingTemplate messagingTemplate) {
        this.quizService = quizService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/quiz/{salaId}/responder")
    public void responder(@DestinationVariable String salaId, @Payload RespostaQuizPayload payload,
                          SimpMessageHeaderAccessor headers) {
        UUID userId = headers.getSessionAttributes() == null ? null : (UUID) headers.getSessionAttributes().get("userId");
        ResultadoRespostaPayload resultado = quizService.responder(salaId, payload, userId);
        if (userId == null) {
            messagingTemplate.convertAndSend("/topic/quiz/" + salaId + "/respostas", resultado);
        } else {
            messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/quiz/respostas", resultado);
        }
        messagingTemplate.convertAndSend("/topic/quiz/" + salaId + "/ranking", quizService.ranking(salaId));
    }
}
