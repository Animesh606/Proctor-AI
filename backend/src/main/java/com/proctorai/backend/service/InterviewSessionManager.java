package com.proctorai.backend.service;

import com.proctorai.backend.dto.ChatMessage;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InterviewSessionManager {

    private final Map<String, List<ChatMessage>> activeSession = new ConcurrentHashMap<>();

    public void startSession(String sessionId, String initialPrompt) {
        List<ChatMessage> history = new ArrayList<>();
        history.add(new ChatMessage("user", initialPrompt));
        activeSession.put(sessionId, history);
    }

    public void endSession(String sessionId) {
        activeSession.remove(sessionId);
    }

    public List<ChatMessage> getHistory(String sessionId) {
        return activeSession.getOrDefault(sessionId, new ArrayList<>());
    }

    public void addMessage(String sessionId, ChatMessage chatMessage) {
        activeSession.computeIfAbsent(sessionId, k -> new ArrayList<>()).add(chatMessage);
    }
}
