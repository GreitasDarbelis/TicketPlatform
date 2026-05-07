package com.ticketplatform.backend.service;

import com.ticketplatform.backend.dto.auth.AuthUserDto;
import com.ticketplatform.backend.dto.auth.LoginRequest;
import com.ticketplatform.backend.dto.auth.SignupRequest;
import com.ticketplatform.backend.model.User;
import com.ticketplatform.backend.repository.UserRepository;
import com.ticketplatform.backend.security.CustomUserDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.Locale;
import java.util.Set;

@Service
@Transactional
public class AuthService {

    private static final Set<String> ALLOWED_ROLES = Set.of("customer", "organizer", "staff");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            CustomUserDetailsService userDetailsService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public AuthUserDto signup(SignupRequest request, HttpServletRequest httpRequest) {
        String email = normalizeEmail(request.email());
        String role = normalizeRole(request.role());

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered.");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);

        user = userRepository.save(user);

        setSessionAuthentication(user, httpRequest);
        return toDto(user);
    }

    public AuthUserDto login(LoginRequest request, HttpServletRequest httpRequest) {
        String email = normalizeEmail(request.email());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));

        setSessionAuthentication(user, httpRequest);
        return toDto(user);
    }

    @Transactional(readOnly = true)
    public AuthUserDto me(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated.");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated."));

        return toDto(user);
    }

    public void logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }

    private void setSessionAuthentication(User user, HttpServletRequest request) {
        UserDetails principal = userDetailsService.loadUserByUsername(user.getEmail());

        var authentication = new UsernamePasswordAuthenticationToken(
                principal,
                null,
                principal.getAuthorities()
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        request.getSession(true);
    }

    private AuthUserDto toDto(User user) {
        return new AuthUserDto(user.getId(), user.getEmail(), user.getRole());
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeRole(String role) {
        String normalized = role.trim().toLowerCase(Locale.ROOT);
        if (!ALLOWED_ROLES.contains(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role.");
        }
        return normalized;
    }
}
