package com.proctorai.backend.service;

import com.proctorai.backend.dto.interviewDtos.ChatMessage;
import com.proctorai.backend.dto.gemini.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GeminiServiceClient {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.model}")
    private String apiModel;

    public Mono<String> getNextQuestion(List<ChatMessage> history) {
        List<Content> geminiContents = history.stream()
                .map(chatMessage -> {
                    String role = "user".equalsIgnoreCase(chatMessage.from()) ? "user" : "model";
                    return new Content(role, List.of(new Part(chatMessage.text())));
                })
                .toList();
        GeminiRequest request = new GeminiRequest(geminiContents);

        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/{model}:generateContent")
                        .queryParam("key", apiKey)
                        .build(apiModel))
                .bodyValue(request)
                .retrieve()
                .bodyToMono(GeminiResponse.class)
                .map(response -> {
                    System.out.println(response);
                    if(response != null && response.candidates() != null && !response.candidates().isEmpty()) {
                        Candidate firstCandidate = response.candidates().getFirst();
                        if(firstCandidate.content() != null && firstCandidate.content().parts() != null && !firstCandidate.content().parts().isEmpty()) {
                            return firstCandidate.content().parts().getFirst().text();
                        }
                    }
                    return "I'm sorry, I seem to be having trouble connecting. Let's try again.";
                })
                .onErrorResume(e -> {
                    System.out.println("Error calling Gemini API: " + e.getMessage());
                    return Mono.just("There was an error processing your request. Please try again.");
                });
    }

    public Mono<String> generateFeedback(String prompt) {
        GeminiRequest request = new GeminiRequest(
                List.of(new Content("user", List.of(new Part(prompt))))
        );

        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/{model}:generateContent")
                        .queryParam("key", apiKey)
                        .build(apiModel))
                .bodyValue(request)
                .retrieve()
                .bodyToMono(GeminiResponse.class)
                .map(response -> {
                    if (response != null && response.candidates() != null && !response.candidates().isEmpty()) {
                        return response.candidates().getFirst().content().parts().getFirst().text();
                    }
                    return "{}";
                })
                .onErrorResume(e -> {
                    System.err.println("Error calling Gemini API for feedback: " + e.getMessage());
                    return Mono.just("{\"error\": \"Failed to generate feedback.\"}");
                });
    }
}
