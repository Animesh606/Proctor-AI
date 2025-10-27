package com.proctorai.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.proctorai.backend.dto.interviewDtos.ChatMessage;
import com.proctorai.backend.dto.gemini.FeedbackResponse;
import com.proctorai.backend.entity.FeedbackReport;
import com.proctorai.backend.entity.InterviewSession;
import com.proctorai.backend.repository.FeedbackReportRepository;
import com.proctorai.backend.repository.InterviewSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final InterviewSessionRepository interviewSessionRepository;
    private final GeminiServiceClient geminiServiceClient;
    private final FeedbackReportRepository feedbackReportRepository;
    private final ObjectMapper objectMapper;

    @Async
    public void generateAndSaveFeedback(UUID interviewId, List<ChatMessage> transcript){
        System.out.println("Starting feedback generating process for session: " + interviewId);

        InterviewSession interviewSession = interviewSessionRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview Session Not Found"));

        String feedbackPrompt = buildFeedbackPrompt(interviewSession, transcript);

        geminiServiceClient.generateFeedback(feedbackPrompt).subscribe(feedbackJson -> {
            System.out.println("Feedback received from Proctor: " + feedbackJson);

            try {
                String cleanJson = feedbackJson.replace("```json", "").replace("```", "").trim();

                FeedbackResponse feedbackData = objectMapper.readValue(cleanJson, FeedbackResponse.class);

                FeedbackReport report = FeedbackReport.builder()
                        .interviewSession(interviewSession)
                        .technicalScore(feedbackData.technicalScore())
                        .communicationScore(feedbackData.communicationScore())
                        .strengths(objectMapper.writeValueAsString(feedbackData.strengths()))
                        .areasForImprovement(objectMapper.writeValueAsString(feedbackData.areasForImprovement()))
                        .overallSummary(feedbackData.overallSummary())
                        .generatedAt(LocalDateTime.now())
                        .build();

                feedbackReportRepository.save(report);
                System.out.println("Feedback Generated Successfully for session: " + interviewId);
            } catch (JsonProcessingException e) {
                System.err.println("Failed to parse feedback JSON for session: " + interviewId);
                e.printStackTrace();
            }
        });
    }

    private String buildFeedbackPrompt(InterviewSession session, List<ChatMessage> transcript) {
        String transcriptString = transcript.stream()
                .map(msg -> msg.from() + ": " + msg.text())
                .collect(Collectors.joining("\n"));

        return String.format(
                "You are a senior hiring manager from a top IT Company. The following is a transcript of a technical interview for a '%s' role for a '%s' candidate.\n\nTRANSCRIPT: \n%s\n\nTASK: Analyze the candidate's performance based on the entire conversation. Provide feedback on their technical accuracy, problem-solving approach, and communication clarity. Return the output as a single valid JSON object only. Do not include any other text or markdown formatting. The JSON object must have the following exact structure: { \"technicalScore\": <number_out_of_10>, \"communicationScore\": <number_out_of_10>, \"strengths\": [\"<strength_1>\", \"<strength_2>\"], \"areasForImprovement\": [\"<improvement_1>\", \"<improvement_2>\"], \"overallSummary\": \"<a_paragraph_summary>\" }",
                session.getInterviewType().replace("_", " "),
                session.getExperienceLevel(),
                transcriptString
        );
    }
}
