package com.proctorai.backend.repository;

import com.proctorai.backend.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, UUID> {
}
