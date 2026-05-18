package com.ticketplatform.backend.service;

import com.ticketplatform.backend.dto.PurchaseTicketsRequest;
import com.ticketplatform.backend.dto.PurchasedTicketDto;
import com.ticketplatform.backend.model.Event;
import com.ticketplatform.backend.model.Ticket;
import com.ticketplatform.backend.model.User;
import com.ticketplatform.backend.repository.EventRepository;
import com.ticketplatform.backend.repository.TicketRepository;
import com.ticketplatform.backend.repository.UserRepository;
import com.ticketplatform.backend.service.strategy.TicketPriceStrategy;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketPriceStrategy ticketPriceStrategy;

    public TicketService(
            EventRepository eventRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository,
            TicketPriceStrategy ticketPriceStrategy
    ) {
        this.eventRepository = eventRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.ticketPriceStrategy = ticketPriceStrategy;
    }

    @Transactional
    public List<PurchasedTicketDto> purchaseTickets(UUID eventId, PurchaseTicketsRequest request, Authentication authentication) {
        int quantity = validateQuantity(request);
        User attendee = resolveAuthenticatedUser(authentication);
        Event event = eventRepository.findByIdForUpdate(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));

        validateAvailability(event, quantity);

        double pricePaid = ticketPriceStrategy.calculatePrice(event, attendee);
        LocalDateTime purchasedAt = LocalDateTime.now();
        List<Ticket> createdTickets = new ArrayList<>(quantity);

        for (int index = 0; index < quantity; index++) {
            Ticket ticket = new Ticket();
            ticket.setEvent(event);
            ticket.setAttendee(attendee);
            ticket.setQrCode(generateTicketCode());
            ticket.setStatus("VALID");
            ticket.setPurchasedAt(purchasedAt);
            ticket.setPricePaid(pricePaid);
            createdTickets.add(ticket);
        }

        return ticketRepository.saveAll(createdTickets)
                .stream()
                .map(this::toPurchasedTicketDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PurchasedTicketDto> getMyTickets(Authentication authentication) {
        User attendee = resolveAuthenticatedUser(authentication);

        return ticketRepository.findByAttendeeIdOrderByPurchasedAtDescIdDesc(attendee.getId())
                .stream()
                .map(this::toPurchasedTicketDto)
                .toList();
    }

    private int validateQuantity(PurchaseTicketsRequest request) {
        if (request == null || request.quantity() == null || request.quantity() < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1.");
        }

        return request.quantity();
    }

    private User resolveAuthenticatedUser(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated.");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated."));
    }

    private void validateAvailability(Event event, int requestedQuantity) {
        if (event.getTotalTickets() == null) {
            return;
        }

        long soldTickets = ticketRepository.countByEventId(event.getId());
        long remainingTickets = event.getTotalTickets() - soldTickets;

        if (remainingTickets < requestedQuantity) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Not enough tickets available.");
        }
    }

    private PurchasedTicketDto toPurchasedTicketDto(Ticket ticket) {
        Event event = ticket.getEvent();

        return new PurchasedTicketDto(
                ticket.getId(),
                event.getId(),
                event.getTitle(),
                event.getDate(),
                event.getLocation(),
                event.getImageData(),
                ticket.getQrCode(),
                ticket.getStatus(),
                ticket.getPurchasedAt(),
                ticket.getPricePaid()
        );
    }

    private String generateTicketCode() {
        return "TKT-" + UUID.randomUUID().toString().replace("-", "").toUpperCase();
    }
}
