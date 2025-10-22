package com.proctorai.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record InterviewHistoryDto(
        UUID sessionId,
        String interviewType,
        String experienceLevel,
        LocalDateTime createdAt
) {}
