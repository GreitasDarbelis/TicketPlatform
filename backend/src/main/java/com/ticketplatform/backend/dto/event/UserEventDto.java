package com.ticketplatform.backend.dto.event;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserEventDto(
        UUID eventId,
        String title,
        LocalDateTime date,
        String location,
        String imageData,
        Integer ticketCount
) {}
