package com.ticketplatform.backend.dto;

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

