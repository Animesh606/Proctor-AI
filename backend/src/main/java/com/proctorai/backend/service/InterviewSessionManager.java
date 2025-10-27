package com.proctorai.backend.service;

import com.proctorai.backend.dto.interviewDtos.ChatMessage;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InterviewSessionManager {

    private final Map<String, List<ChatMessage>> activeSession = new ConcurrentHashMap<>();
    private final Map<String, String> interviewIdToSessionId = new ConcurrentHashMap<>();

    public void startSessionByInterviewId(String sessionId, String interviewId, String initialPrompt) {
        List<ChatMessage> history = new ArrayList<>();
        history.add(new ChatMessage("user", initialPrompt));
        activeSession.put(sessionId, history);
        interviewIdToSessionId.put(interviewId, sessionId);
    }

    public void endSessionByInterviewId(String interviewId) {
        String sessionId = interviewIdToSessionId.remove(interviewId);
        if(sessionId != null) {
            activeSession.remove(sessionId);
        }
    }

    public List<ChatMessage> getHistoryByWsSessionId(String sessionId) {
        return activeSession.getOrDefault(sessionId, new ArrayList<>());
    }

    public List<ChatMessage> getHistoryByInterviewId(String interviewId) {
        String sessionId = interviewIdToSessionId.get(interviewId);
        if(sessionId != null) {
            return getHistoryByWsSessionId(sessionId);
        }
        return new ArrayList<>();
    }

    public void addMessage(String sessionId, ChatMessage chatMessage) {
        activeSession.computeIfAbsent(sessionId, k -> new ArrayList<>()).add(chatMessage);
    }
}
