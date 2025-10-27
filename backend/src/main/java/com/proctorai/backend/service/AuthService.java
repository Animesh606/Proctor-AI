package com.proctorai.backend.service;

import com.proctorai.backend.dto.*;
import com.proctorai.backend.entity.User;
import com.proctorai.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final EmailService emailService;

    @Transactional
    public RegistrationPendingResponse register(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent() && existingUser.get().isEnabled()) {
            throw new IllegalArgumentException("Email already registered and verified.");
        }

        User newUser;
        if (existingUser.isPresent()) {
            newUser = existingUser.get();
            newUser.setUsername(request.getUsername());
            newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        } else {
            newUser = User.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .enabled(false)
                    .build();
        }

        userRepository.save(newUser);

        String otp = otpService.generateOtp(request.getEmail());
        emailService.sendOtpEmail(request.getEmail(), otp);

        return new RegistrationPendingResponse("OTP sent to your email. Please verify to complete registration.");
    }

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        if (!otpService.validateOtp(request.email(), request.otp())) {
            throw new BadCredentialsException("Invalid or expired OTP.");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found during OTP verification."));

        if (user.isEnabled()) {
            throw new IllegalStateException("Account is already verified.");
        }

        user.setEnabled(true);
        userRepository.save(user);
        otpService.clearOtp(request.email());

        String jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken);
    }

    public AuthResponse authenticate(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (DisabledException e) {
            throw new DisabledException("Account not verified. Please check your email for the OTP or register again.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .build();
    }
}
