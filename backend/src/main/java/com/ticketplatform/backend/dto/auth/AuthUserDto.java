package com.ticketplatform.backend.dto.auth;

import java.util.UUID;

public record AuthUserDto(
        UUID id,
        String username,
        String email,
        String role
) {
}
