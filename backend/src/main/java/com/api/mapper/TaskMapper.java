package com.api.mapper;

import com.api.dto.TaskDto;
import com.api.entity.Task;
import com.api.entity.From;

public class TaskMapper {

    public static TaskDto mapToTaskDto(Task task) {
        if (task == null) {
            return null;
        }
        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getFrom() != null ? task.getFrom().name() : null,
                task.getIsPublic(),
                task.getPosition(),
                task.getCreateUser() != null ? task.getCreateUser().getId() : null,
                task.getAssignedUser() != null ? task.getAssignedUser().getId() : null
        );
    }

    public static Task mapToTask(TaskDto taskDto) {
        if (taskDto == null) {
            return null;
        }
        Task task = new Task();
        task.setId(taskDto.getId());
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDueDate(taskDto.getDueDate());
        task.setFrom(taskDto.getFrom() != null ? From.valueOf(taskDto.getFrom()) : null);
        task.setIsPublic(taskDto.getIsPublic());
        task.setPosition(taskDto.getPosition());
        return task;
    }
}
