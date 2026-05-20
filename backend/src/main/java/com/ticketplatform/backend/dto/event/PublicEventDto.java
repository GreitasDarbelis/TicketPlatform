package com.ticketplatform.backend.dto.event;

import java.time.LocalDateTime;
import java.util.UUID;

public record PublicEventDto(
        UUID id,
        String title,
        String description,
        LocalDateTime date,
        String location,
        String imageData,
        Integer totalTickets,
        String organizerEmail
) {
}