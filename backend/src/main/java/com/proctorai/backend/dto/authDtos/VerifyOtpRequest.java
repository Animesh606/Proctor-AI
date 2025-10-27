package com.proctorai.backend.dto.authDtos;

public record VerifyOtpRequest(
        String email,
        String otp
) {}
