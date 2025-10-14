package com.proctorai.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "interview_type", nullable = false)
    private String interviewType;

    @Column(name = "experience_level", nullable = false)
    private String experienceLevel;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "custom_requirements", columnDefinition = "TEXT")
    private String customRequirements;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public enum SessionStatus {
        SCHEDULED,
        IN_PROGRESS,
        COMPLETED
    }
}
