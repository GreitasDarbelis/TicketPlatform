package com.ticketplatform.backend.repository;

import com.ticketplatform.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

// REQUIREMENT: Security (SQL injection prevention)
// Spring Data JPA (JpaRepository) automatically uses secure 'Prepared Statements'
// for data retrieval, thus protecting the system from SQL injections.

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    @Query("SELECT DISTINCT t.event FROM Ticket t WHERE t.attendee.id = :attendeeId ORDER BY t.event.date ASC")
    List<Event> findEventsByAttendeeId(@Param("attendeeId") UUID attendeeId);
}
