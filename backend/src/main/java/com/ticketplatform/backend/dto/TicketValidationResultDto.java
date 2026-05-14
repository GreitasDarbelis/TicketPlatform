package com.ticketplatform.backend.dto;

import java.util.UUID;

public record TicketValidationResultDto(
        boolean accepted,
        String outcome,
        String message,
        UUID ticketId,
        String ticketCode
) {
}