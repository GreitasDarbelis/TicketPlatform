package com.ticketplatform.backend.service;

import com.ticketplatform.backend.dto.ticket.PurchaseTicketRequest;
import com.ticketplatform.backend.dto.ticket.PurchaseTicketResponse;
import com.ticketplatform.backend.dto.ticket.UserTicketDto;
import com.ticketplatform.backend.model.Event;
import com.ticketplatform.backend.model.Ticket;
import com.ticketplatform.backend.model.User;
import com.ticketplatform.backend.repository.EventRepository;
import com.ticketplatform.backend.repository.TicketRepository;
import com.ticketplatform.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository, EventRepository eventRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional(readOnly = true)
    public List<UserTicketDto> getTicketsByEventIdAndAttendeeId(UUID eventId, UUID attendeeId) {
        List<Ticket> tickets = ticketRepository.findByEventIdAndAttendeeId(eventId, attendeeId);

        if (tickets.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No tickets found for this event.");
        }

        return tickets.stream()
                .map(ticket -> new UserTicketDto(
                        ticket.getId(),
                        ticket.getEvent().getTitle(),
                        ticket.getEvent().getDate(),
                        ticket.getEvent().getLocation(),
                        ticket.getTicketCode()
                ))
                .toList();
    }

    @Transactional
    public List<PurchaseTicketResponse> purchaseTickets(PurchaseTicketRequest request) {
        validatePurchaseRequest(request);

        Event event = eventRepository.findById(request.eventId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));

        if (event.getDate().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot purchase tickets for past events.");
        }

        int availableTickets = event.getAvailableTickets();
        if (availableTickets < request.ticketQuantity()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Not enough tickets available. Available: " + availableTickets + ", Requested: " + request.ticketQuantity()
            );
        }

        User attendee = userRepository.findById(request.attendeeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Attendee not found."));

        List<Ticket> createdTickets = new ArrayList<>();
        for (int i = 0; i < request.ticketQuantity(); ++i) {
            Ticket ticket = new Ticket();
            ticket.setEvent(event);
            ticket.setAttendee(attendee);
            ticket.setStatus("VALID");
            ticket.setTicketCode(generateTicketCode());

            Ticket saved = ticketRepository.save(ticket);
            createdTickets.add(saved);
        }

        event.setAvailableTickets(event.getAvailableTickets() - request.ticketQuantity());
        eventRepository.save(event);

        return createdTickets.stream()
                .map(ticket -> toTicketDto(ticket, event))
                .toList();
    }

    private void validatePurchaseRequest(PurchaseTicketRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required.");
        }

        if (request.eventId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event ID is required.");
        }

        if (request.attendeeId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attendee ID is required.");
        }

        if (request.ticketQuantity() == null || request.ticketQuantity() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ticket quantity must be greater than 0.");
        }
    }

    private String generateTicketCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder("TKT-");

        for (int i = 0; i < 9; ++i) {
            int index = (int) (Math.random() * characters.length());
            code.append(characters.charAt(index));
        }

        return code.toString();
    }

    private PurchaseTicketResponse toTicketDto(Ticket ticket, Event event) {
        return new PurchaseTicketResponse(
                ticket.getId(),
                event.getTitle(),
                event.getDate(),
                event.getLocation(),
                ticket.getTicketCode()
        );
    }
}
