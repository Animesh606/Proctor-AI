package com.proctorai.backend.service;

import com.proctorai.backend.dto.CreateInterviewRequest;
import com.proctorai.backend.dto.CreateInterviewResponse;
import com.proctorai.backend.entity.InterviewSession;
import com.proctorai.backend.entity.User;
import com.proctorai.backend.repository.InterviewSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewSessionRepository interviewSessionRepository;

    public CreateInterviewResponse createInterviewSession(CreateInterviewRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        InterviewSession session = InterviewSession.builder()
                .user(currentUser)
                .interviewType(request.interviewType())
                .experienceLevel(request.experienceLevel())
                .durationMinutes(request.durationMinutes())
                .customRequirements(request.customRequirements())
                .status(InterviewSession.SessionStatus.SCHEDULED)
                .createdAt(LocalDateTime.now())
                .build();

        InterviewSession interviewSession = interviewSessionRepository.save(session);

        return new CreateInterviewResponse(interviewSession.getId());
    }
}
