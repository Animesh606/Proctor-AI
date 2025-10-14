package com.proctorai.backend.dto;

public record CreateInterviewRequest(
        String interviewType,
        String experienceLevel,
        Integer durationMinutes,
        String customRequirements
) {}
