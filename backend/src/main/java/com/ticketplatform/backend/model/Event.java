package com.ticketplatform.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String imageData;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    private Integer totalTickets;

    // REQUIREMENT: Data consistency; Optimistic locking
    // If two organizers attempt to edit an event simultaneously,
    // the system will throw an ObjectOptimisticLockingFailureException.
    @Version
    private Integer version;
}
