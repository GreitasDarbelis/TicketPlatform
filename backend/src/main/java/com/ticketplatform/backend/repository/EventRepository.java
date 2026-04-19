package com.ticketplatform.backend.repository;

import com.ticketplatform.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

// REQUIREMENT: Security (SQL injection prevention)
// Spring Data JPA (JpaRepository) automatically uses secure 'Prepared Statements'
// for data retrieval, thus protecting the system from SQL injections.

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    // Additional methods can be written here, e.g.:
    // List<Event> findByTitleContainingIgnoreCase(String title);
}
