package com.proctorai.backend.service;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {
    private static  final Integer EXPIRE_MINUTE = 5;
    private LoadingCache<String, String> otpCache;

    public OtpService() {
        otpCache = CacheBuilder.newBuilder()
                .expireAfterWrite(EXPIRE_MINUTE, TimeUnit.MINUTES)
                .build(new CacheLoader<>() {
                    @Override
                    public String load(String key) throws Exception {
                        return "";
                    }
                });
    }

    public String generateOtp(String email) {
        SecureRandom random = new SecureRandom();
        String otp = String.format("%06d", random.nextInt(999999));
        otpCache.put(email, otp);
        return otp;
    }

    public String getOtp(String email) {
        try {
            return otpCache.getIfPresent(email);
        } catch (Exception e) {
            return null;
        }
    }

    public void clearOtp(String email) {
        otpCache.invalidate(email);
    }

    public boolean validateOtp(String email, String otp) {
        String cachedOtp = otpCache.getIfPresent(email);
        return (otp != null && otp.equals(cachedOtp));
    }
}
