package com.ticketplatform.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role; // "ORGANIZER" or "ATTENDEE"

    // REQUIREMENT: Data consistency; Optimistic locking
    // JPA Optimistic locking technique - version column preventing concurrent conflicting updates.
    @Version
    private Integer version;
}
