package com.qnabounty.qna_backend.controller;

import com.qnabounty.qna_backend.dto.AuthRequest;
import com.qnabounty.qna_backend.dto.AuthResponse;
import com.qnabounty.qna_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody AuthRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return authService.login(request);
    }
}
