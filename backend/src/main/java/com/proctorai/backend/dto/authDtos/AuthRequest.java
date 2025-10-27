package com.proctorai.backend.dto.authDtos;

public record AuthRequest (
    String email,
    String password
){}
