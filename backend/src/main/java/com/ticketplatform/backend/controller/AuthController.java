package com.ticketplatform.backend.controller;

import com.ticketplatform.backend.dto.auth.AuthResponse;
import com.ticketplatform.backend.dto.auth.AuthUserDto;
import com.ticketplatform.backend.dto.auth.LoginRequest;
import com.ticketplatform.backend.dto.auth.SignupRequest;
import com.ticketplatform.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @Valid @RequestBody SignupRequest request,
            HttpServletRequest httpRequest
    ) {
        AuthUserDto user = authService.signup(request, httpRequest);
        return ResponseEntity.ok(new AuthResponse(user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        AuthUserDto user = authService.login(request, httpRequest);
        return ResponseEntity.ok(new AuthResponse(user));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(Authentication authentication) {
        AuthUserDto user = authService.me(authentication);
        return ResponseEntity.ok(new AuthResponse(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }
}
