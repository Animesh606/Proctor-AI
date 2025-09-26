package com.proctorai.backend.controller;

import com.proctorai.backend.dto.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class InterviewController {

    private final SimpMessageSendingOperations messagingTemplate;

    private final Map<String, Integer> userQuestionState = new ConcurrentHashMap<>();
    private final String[] questions = {
            "Welcome to Proctor AI! Let's begin. Tell me about a challenging project you've worked on.",
            "Interesting. What was your specific role in that project?",
            "What was the most difficult technical challenge you faced, and how did you solve it?",
            "Thank you for sharing. That concludes our session for now."
    };

    public InterviewController(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/interview.start")
    public void startInterview(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        userQuestionState.put(sessionId, 0);
        sendQuestionToUser(sessionId);
    }

    @MessageMapping("/interview.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        Integer currentQuestion = userQuestionState.getOrDefault(sessionId, 0);
        userQuestionState.put(sessionId, currentQuestion + 1);
        sendQuestionToUser(sessionId);
    }

    private void sendQuestionToUser(String sessionId) {
        Integer questionIndex = userQuestionState.get(sessionId);
        if(questionIndex != null && questionIndex < questions.length) {
            ChatMessage botMessage = ChatMessage.builder()
                    .from("Proctor")
                    .text(questions[questionIndex])
                    .build();
            messagingTemplate.convertAndSend("/topic/interview/" + sessionId, botMessage);
        }
    }
}
