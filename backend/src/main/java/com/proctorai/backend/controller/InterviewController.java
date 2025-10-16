package com.proctorai.backend.controller;

import com.proctorai.backend.dto.ChatMessage;
import com.proctorai.backend.dto.CreateInterviewRequest;
import com.proctorai.backend.dto.CreateInterviewResponse;
import com.proctorai.backend.entity.InterviewSession;
import com.proctorai.backend.repository.InterviewSessionRepository;
import com.proctorai.backend.service.GeminiServiceClient;
import com.proctorai.backend.service.InterviewService;
import com.proctorai.backend.service.InterviewSessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Objects;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class InterviewController {

    private final SimpMessageSendingOperations messagingTemplate;
    private final GeminiServiceClient geminiServiceClient;
    private final InterviewSessionManager sessionManager;
    private final InterviewSessionRepository interviewSessionRepository;
    private final InterviewService interviewService;

    @PostMapping("/api/interviews")
    public ResponseEntity<CreateInterviewResponse> saveInterviewSession(@RequestBody CreateInterviewRequest request) {
        return ResponseEntity.ok(interviewService.createInterviewSession(request));
    }

    @MessageMapping("/interview.start")
    public void startInterview(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        String interviewIdStr = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("interviewSessionId");
        if (sessionId == null || interviewIdStr == null) return;

        UUID interviewId = UUID.fromString(interviewIdStr);
        interviewSessionRepository.findById(interviewId).ifPresent(sessionDetails -> {
            if (sessionDetails.getStatus() == InterviewSession.SessionStatus.SCHEDULED) {
                sessionDetails.setStatus(InterviewSession.SessionStatus.IN_PROGRESS);
                interviewSessionRepository.save(sessionDetails);
                String initialPrompt = String.format(
                        "You are 'Proctor', an expert technical interviewer from a top tech company. Your tone is professional, encouraging and sharp. Your goal is to conduct a %d-minute interview for a '%s' role for a '%s' candidate. If the user provided special instructions, adhere to them: '%s'. Start with a friendly introduction. Do not add any markdown just use simple text.",
                        sessionDetails.getDurationMinutes(), sessionDetails.getInterviewType(), sessionDetails.getExperienceLevel(), sessionDetails.getCustomRequirements()
                );
                sessionManager.startSessionByInterviewId(sessionId, interviewIdStr, initialPrompt);

            }
            else {
                System.out.print("Ignoring duplicate start requests for already running or completed session: " + interviewIdStr);
            }
            sendQuestionToUser(sessionId, interviewIdStr);
        });
    }

    @MessageMapping("/interview.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        String interviewIdStr = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("interviewSessionId");

        if (sessionId == null || interviewIdStr == null) return;

        sessionManager.addMessage(sessionId, new ChatMessage("user", chatMessage.getText()));
        sendQuestionToUser(sessionId, interviewIdStr);
    }

    private void sendQuestionToUser(String sessionId, String interviewId) {
        geminiServiceClient.getNextQuestion(sessionManager.getHistoryByWsSessionId(sessionId)).subscribe(aiResponse -> {
            ChatMessage botMessage = new ChatMessage("Proctor", aiResponse);
            sessionManager.addMessage(sessionId, botMessage);
            messagingTemplate.convertAndSend("/topic/interview/" + interviewId, botMessage);
        });
    }
}
