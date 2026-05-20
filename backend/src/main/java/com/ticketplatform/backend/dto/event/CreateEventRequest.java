package com.ticketplatform.backend.dto.event;

public record CreateEventRequest(
        String title,
        String description,
        String date,
        String time,
        String location,
        String imageUrl,
        Integer totalTickets,
        String organizerEmail
) {
}

