package com.ticketplatform.backend.repository;

import com.ticketplatform.backend.model.Event;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

// REQUIREMENT: Security (SQL injection prevention)
// Spring Data JPA (JpaRepository) automatically uses secure 'Prepared Statements'
// for data retrieval, thus protecting the system from SQL injections.

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select event from Event event where event.id = :eventId")
    Optional<Event> findByIdForUpdate(@Param("eventId") UUID eventId);
}
