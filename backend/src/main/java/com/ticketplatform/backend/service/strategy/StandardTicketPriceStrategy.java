package com.ticketplatform.backend.service.strategy;

import com.ticketplatform.backend.model.Event;
import com.ticketplatform.backend.model.User;
import org.springframework.stereotype.Component;

@Component("standardPriceStrategy")
public class StandardTicketPriceStrategy implements TicketPriceStrategy {

    private static final double STANDARD_TICKET_PRICE = 75.0;

    @Override
    public double calculatePrice(Event event, User attendee) {
        return STANDARD_TICKET_PRICE;
    }
}
