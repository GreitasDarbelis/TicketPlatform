package com.ticketplatform.backend.service;

import com.ticketplatform.backend.dto.TicketValidationResultDto;
import com.ticketplatform.backend.model.Event;
import com.ticketplatform.backend.model.Ticket;
import com.ticketplatform.backend.repository.EventRepository;
import com.ticketplatform.backend.repository.TicketRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class TicketValidationService {

    private static final String STATUS_VALID = "VALID";
    private static final String STATUS_USED = "USED";
    private static final String OUTCOME_ACCEPTED = "ACCEPTED";
    private static final String OUTCOME_REJECTED = "REJECTED";
    private static final String STAFF_ROLE = "ROLE_STAFF";

    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;

    public TicketValidationService(EventRepository eventRepository, TicketRepository ticketRepository) {
        this.eventRepository = eventRepository;
        this.ticketRepository = ticketRepository;
    }

    public TicketValidationResultDto validate(UUID eventId, String rawTicketCode, Authentication authentication) {
        requireStaff(authentication); // only staff can validate
        Event event = eventRepository.findById(eventId) // ensure event exists
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));

        Set<String> candidateCodes = normalizeCandidateCodes(rawTicketCode); // generate candidate codes to handle common input variations
        Ticket ticket = findTicket(candidateCodes);
        if (ticket == null) {
            return rejected("Ticket code was not recognized.");
        }

        if (!event.getId().equals(ticket.getEvent().getId())) { // ensure ticket belongs to the specified event
            return rejected(ticket, "Ticket does not belong to this event.");
        }

        String currentStatus = normalizeStatus(ticket.getStatus());
        if (STATUS_USED.equals(currentStatus)) { // ticket has already been used
            return rejected(ticket, "Ticket has already been used.");
        }

        if (!STATUS_VALID.equals(currentStatus)) { // ticket is not in a valid state for entry
            return rejected(ticket, "Ticket is not valid for entry.");
        }

        ticket.setStatus(STATUS_USED); // mark ticket as used if all checks passed
        ticketRepository.save(ticket);
        return accepted(ticket, "Ticket accepted. Entry granted.");
    }

    private void requireStaff(Authentication authentication) { // ensure the user has staff role to perform validation
        if (authentication == null || authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .noneMatch(STAFF_ROLE::equals)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Staff access is required.");
        }
    }

    private Set<String> normalizeCandidateCodes(String rawTicketCode) {
        if (rawTicketCode == null || rawTicketCode.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ticket code is required.");
        }

        String normalized = rawTicketCode.trim();
        Set<String> candidates = new LinkedHashSet<>();
        candidates.add(normalized);

        int colonIndex = normalized.lastIndexOf(':');
        if (colonIndex >= 0 && colonIndex < normalized.length() - 1) {
            candidates.add(normalized.substring(colonIndex + 1).trim());
        }

        return candidates;
    } // generate a set of candidate ticket codes to handle whitespace, prefixes

    private Ticket findTicket(Set<String> candidateCodes) {
        for (String candidate : candidateCodes) {
            if (candidate.isEmpty()) {
                continue;
            }

            Ticket ticket = ticketRepository.findByQrCodeIgnoreCase(candidate).orElse(null);
            if (ticket != null) {
                return ticket;
            }
        }

        return null;
    } // attempt to find a ticket matching any of the candidate codes, ignoring case

    private String normalizeStatus(String status) {
        return status == null ? "" : status.trim().toUpperCase(Locale.ROOT);
    }

    private TicketValidationResultDto accepted(Ticket ticket, String message) {
        return new TicketValidationResultDto(true, OUTCOME_ACCEPTED, message, ticket.getId(), ticket.getQrCode());
    }

    private TicketValidationResultDto rejected(String message) {
        return new TicketValidationResultDto(false, OUTCOME_REJECTED, message, null, null);
    }

    private TicketValidationResultDto rejected(Ticket ticket, String message) {
        return new TicketValidationResultDto(false, OUTCOME_REJECTED, message, ticket.getId(), ticket.getQrCode());
    }
}