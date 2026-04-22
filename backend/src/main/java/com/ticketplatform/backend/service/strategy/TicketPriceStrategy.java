package com.ticketplatform.backend.service.strategy;

import com.ticketplatform.backend.model.Event;
import com.ticketplatform.backend.model.User;

// REQUIREMENT: Extensibility/Glass-box extensibility
// By changing this strategy to another implementation, we can modify the algorithm
// without recompiling the main code that invokes the price calculation.

public interface TicketPriceStrategy {
    double calculatePrice(Event event, User attendee);
}
