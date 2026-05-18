package com.ticketplatform.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record PurchasedTicketDto(
        UUID id,
        UUID eventId,
        String eventTitle,
        LocalDateTime eventDate,
        String eventLocation,
        String eventImageData,
        String ticketCode,
        String status,
        LocalDateTime purchasedAt,
        double pricePaid
) {
}
