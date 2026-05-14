package com.ticketplatform.backend.controller;

import com.ticketplatform.backend.config.ApiPaths;
import com.ticketplatform.backend.dto.TicketValidationResultDto;
import com.ticketplatform.backend.dto.ValidateTicketRequest;
import com.ticketplatform.backend.service.TicketValidationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.API)
public class TicketValidationController {

    private final TicketValidationService ticketValidationService;

    public TicketValidationController(TicketValidationService ticketValidationService) {
        this.ticketValidationService = ticketValidationService;
    }

    @PostMapping("/events/{eventId}/tickets/validate")
    public ResponseEntity<TicketValidationResultDto> validateTicket(
            @PathVariable UUID eventId,
            @RequestBody ValidateTicketRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(ticketValidationService.validate(eventId, request.ticketCode(), authentication));
    }
}