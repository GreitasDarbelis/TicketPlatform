package com.ticketplatform.backend.dto.ticket;

import java.time.LocalDateTime;
import java.util.UUID;

public record PurchaseTicketResponse(
        UUID ticketId,
        String eventTitle,
        LocalDateTime eventDate,
        String eventLocation,
        String ticketCode
) {
}
