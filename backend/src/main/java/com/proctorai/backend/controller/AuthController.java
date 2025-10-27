package com.proctorai.backend.controller;

import com.proctorai.backend.dto.authDtos.*;
import com.proctorai.backend.entity.User;
import com.proctorai.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegistrationPendingResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<Void> resendOtp(@RequestBody ResendOtpRequest request) {
        try {
            authService.resendOtp(request.email());
            return ResponseEntity.ok().build();
        } catch (UsernameNotFoundException | IllegalStateException e) {
            System.out.println("Resend OTP failed: " + e.getMessage());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Unexpected error during resend OTP: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            authService.createPasswordResetTokenForUser(request.email());
            return ResponseEntity.ok().build();
        } catch (UsernameNotFoundException e) {
            System.err.println("Forgot Password attempt for not-existent email: " + request.email());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Unexpected error during forgot password attempt: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordRequest request) {
        Optional<User> userOptional = authService.getUserByPasswordResetToken(request.token());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            authService.changeUserPassword(userOptional.get(), request.newPassword());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Unexpected error during reset password: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
