package com.proctorai.backend.dto.gemini;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record Content(@JsonProperty("role") String role, List<Part> parts) {
}
