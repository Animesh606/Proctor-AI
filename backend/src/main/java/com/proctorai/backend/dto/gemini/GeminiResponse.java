package com.proctorai.backend.dto.gemini;

import java.util.List;

public record GeminiResponse(List<Candidate> candidates) {
}
