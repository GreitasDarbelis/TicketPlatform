package com.ticketplatform.backend.dto.ticket;

import java.util.UUID;

public record PurchaseTicketRequest(
        UUID eventId,
        UUID attendeeId,
        Integer ticketQuantity
) {
}
