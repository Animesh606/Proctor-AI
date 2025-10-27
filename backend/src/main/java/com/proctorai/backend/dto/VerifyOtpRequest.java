package com.proctorai.backend.dto;

public record VerifyOtpRequest(
        String email,
        String otp
) {}
