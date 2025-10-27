package com.proctorai.backend.dto.interviewDtos;

public record CreateInterviewRequest(
        String interviewType,
        String experienceLevel,
        Integer durationMinutes,
        String customRequirements
) {}
