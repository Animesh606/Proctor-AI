package com.proctorai.backend.controller;

import com.proctorai.backend.dto.ChatMessage;
import com.proctorai.backend.entity.FeedbackReport;
import com.proctorai.backend.repository.FeedbackReportRepository;
import com.proctorai.backend.service.FeedbackService;
import com.proctorai.backend.service.InterviewSessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final InterviewSessionManager interviewSessionManager;
    private final FeedbackReportRepository feedbackReportRepository;

    @PostMapping("/{interviewId}/generate")
    public ResponseEntity<Void> triggerFeedbackGeneration(@PathVariable String interviewId) {
        List<ChatMessage> transcript = interviewSessionManager.getHistoryByInterviewId(interviewId);
        if (transcript.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        feedbackService.generateAndSaveFeedback(UUID.fromString(interviewId), transcript);
        interviewSessionManager.endSessionByInterviewId(interviewId);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/{interviewId}")
    public ResponseEntity<FeedbackReport> getFeedbackReport(@PathVariable String interviewId) {
        return feedbackReportRepository.findByInterviewSessionId(UUID.fromString(interviewId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
