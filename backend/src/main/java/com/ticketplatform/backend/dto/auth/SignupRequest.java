package com.ticketplatform.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record SignupRequest(
    @NotBlank String username,
    @NotBlank String email,
    @NotBlank String password,
    @NotBlank String role
) {
}
