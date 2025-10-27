package com.proctorai.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendOtpEmail(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your Proctor AI Verification Code");
            message.setText("Thank you for registering with Proctor AI.\n\n" +
                    "Your One-Time Password (OTP) is: " + otp + "\n\n" +
                    "This code will expired in 5 minutes. \n\n" +
                    "If you did not request this, please ignore this email.");

            mailSender.send(message);
            System.out.println("OTP email sent successfully to " + email);
        } catch (Exception e) {
            System.out.println("Error sending otp email to " + email + ": " + e.getMessage());
        }
    }

    @Async
    public void sendResetPasswordEmail(String email, String token, String resetUrlBase) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Reset Your Proctor AI Password");
            String resetUrl = resetUrlBase + "/reset-password/" + token;
            message.setText("You requested a password reset for your Proctor AI account.\n\n" +
                    "Click the link below to set a new password:\n" + resetUrl + "\n\n" +
                    "This link will expire in 1 hour.\n\n" +
                    "If you did not request a password reset, please ignore this email.");
            mailSender.send(message);
            System.out.println("Password Reset email sent successfully to " + email);
        } catch (Exception e) {
            System.out.println("Error sending password reset email to " + email + ": " + e.getMessage());
        }
    }
}
