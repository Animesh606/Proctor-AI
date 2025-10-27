package com.proctorai.backend.dto.authDtos;

public record ResetPasswordRequest(
        String token,
        String newPassword
) {}
