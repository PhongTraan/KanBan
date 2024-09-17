package com.api.dto;

import com.api.entity.From;
import com.api.entity.User;
import lombok.*;

import java.time.Instant;
import java.util.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private Integer id;
    private String title;
    private String description;
    private Instant dueDate;
    private String from;
    private Boolean isPublic;
    private Integer position;
    private Integer createUserId;
    private Integer assignedUserId;
}
