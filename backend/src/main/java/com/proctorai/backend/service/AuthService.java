package com.proctorai.backend.service;

import com.proctorai.backend.dto.authDtos.*;
import com.proctorai.backend.entity.PasswordResetToken;
import com.proctorai.backend.entity.User;
import com.proctorai.backend.repository.PasswordResetTokenRepository;
import com.proctorai.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final EmailService emailService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final ResourcePatternResolver resourcePatternResolver;

    @Value("${application.client.url}")
    private String clientUrl;

    @Transactional
    public RegistrationPendingResponse register(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.email());
        if (existingUser.isPresent() && existingUser.get().isEnabled()) {
            throw new IllegalArgumentException("Email already registered and verified.");
        }

        User newUser;
        if (existingUser.isPresent()) {
            newUser = existingUser.get();
            newUser.setUsername(request.username());
            newUser.setPassword(passwordEncoder.encode(request.password()));
        } else {
            newUser = User.builder()
                    .username(request.username())
                    .email(request.email())
                    .password(passwordEncoder.encode(request.password()))
                    .enabled(false)
                    .build();
        }

        userRepository.save(newUser);

        String otp = otpService.generateOtp(request.email());
        emailService.sendOtpEmail(request.email(), otp);

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
                            request.email(),
                            request.password()
                    )
            );
        } catch (DisabledException e) {
            throw new DisabledException("Account not verified. Please check your email for the OTP or register again.");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow();
        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    @Transactional(readOnly = true)
    public void resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Cannot resend OTP: User not found with email " + email));

        if (user.isEnabled()) {
            throw new IllegalStateException("Account is already verified.");
        }

        String otp = otpService.generateOtp(email);
        emailService.sendOtpEmail(email, otp);

        System.out.println("Resent OTP for email: " + email);
    }

    @Transactional
    public void createPasswordResetTokenForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email " + email));

        passwordResetTokenRepository.findByUser(user).ifPresent(passwordResetTokenRepository::delete);

        String token = UUID.randomUUID().toString();
        PasswordResetToken myToken = new PasswordResetToken(token, user);
        passwordResetTokenRepository.save(myToken);
        emailService.sendResetPasswordEmail(user.getEmail(), token, clientUrl);
    }

    public Optional<User> getUserByPasswordResetToken(String token) {
        return passwordResetTokenRepository.findByToken(token)
                .filter(t -> !t.isExpired())
                .map(PasswordResetToken::getUser);
    }

    @Transactional
    public void changeUserPassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.findByUser(user).ifPresent(passwordResetTokenRepository::delete);
    }
}
