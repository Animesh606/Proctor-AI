package com.proctorai.backend.controller;

import com.proctorai.backend.dto.ChatMessage;
import com.proctorai.backend.service.GeminiServiceClient;
import com.proctorai.backend.service.InterviewSessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@RequiredArgsConstructor
public class InterviewController {

    private final SimpMessageSendingOperations messagingTemplate;
    private final GeminiServiceClient geminiServiceClient;
    private final InterviewSessionManager sessionManager;

    @MessageMapping("/interview.start")
    public void startInterview(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        if (sessionId == null) return;

        String initialPrompt = "You are 'Proctor', an expert technical interviewer from a top tech company. Your goal is to conduct a 15-minute interview for a 'Java Backend Developer' role for a fresher. You must ask a mix of technical, coding, and behavioral questions. Start with a friendly introduction and then ask your first question. Do not use markdown in your responses.";
        sessionManager.startSession(sessionId, initialPrompt);
        sendQuestionToUser(sessionId);
    }

    @MessageMapping("/interview.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        if (sessionId == null) return;

        sessionManager.addMessage(sessionId, new ChatMessage("user", chatMessage.getText()));
        sendQuestionToUser(sessionId);
    }

    private void sendQuestionToUser(String sessionId) {
        geminiServiceClient.getNextQuestion(sessionManager.getHistory(sessionId)).subscribe(aiResponse -> {
            ChatMessage botMessage = new ChatMessage("Proctor", aiResponse);
            sessionManager.addMessage(sessionId, botMessage);
            messagingTemplate.convertAndSend("/topic/interview/" + sessionId, botMessage);
        });
    }
}
