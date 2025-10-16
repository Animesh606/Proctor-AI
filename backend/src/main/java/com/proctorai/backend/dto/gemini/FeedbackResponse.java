package com.proctorai.backend.dto.gemini;

import java.util.List;

public record FeedbackResponse(
        int technicalScore,
        int communicationScore,
        List<String> strengths,
        List<String> areasForImprovement,
        String overallSummary
) {}
