package com.api.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;
    private String  title;
    private String description;
    private Instant dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "isFrom")
    private From from;
    private Boolean isPublic;
    private Integer position;

    @ManyToOne
    @JoinColumn(name = "create_user", referencedColumnName = "idUser")
    private User createUser;
    @ManyToOne
    @JoinColumn(name = "assigned_user", referencedColumnName = "idUser")
    private User assignedUser;
}
