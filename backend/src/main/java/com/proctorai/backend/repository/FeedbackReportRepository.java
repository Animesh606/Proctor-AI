package com.proctorai.backend.repository;

import com.proctorai.backend.entity.FeedbackReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FeedbackReportRepository extends JpaRepository<FeedbackReport, UUID> {
    Optional<FeedbackReport> findByInterviewSessionId(UUID interviewSessionId);
}
