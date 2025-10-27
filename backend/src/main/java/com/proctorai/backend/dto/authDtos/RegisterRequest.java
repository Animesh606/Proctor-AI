package com.proctorai.backend.dto.authDtos;

public record RegisterRequest (
    String username,
    String email,
    String password
){}
