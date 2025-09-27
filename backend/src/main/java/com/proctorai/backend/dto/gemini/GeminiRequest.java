package com.proctorai.backend.dto.gemini;

import java.util.List;

public record GeminiRequest(List<Content> contents) {
}
