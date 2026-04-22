package com.ticketplatform.backend.service.strategy;

import com.ticketplatform.backend.model.Event;
import com.ticketplatform.backend.model.User;
import org.springframework.stereotype.Component;

@Component("standardPriceStrategy")
public class StandardTicketPriceStrategy implements TicketPriceStrategy {

    @Override
    public double calculatePrice(Event event, User attendee) {
        // In the future, role-based discounts can be implemented here.
        // For now, a standard static price is returned for illustration purposes.
        return 20.00;
    }
}
