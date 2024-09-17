package com.api.service;

import com.api.dto.MoveTask;
import com.api.dto.TaskDto;
import com.api.entity.Task;

import java.util.List;


public interface TaskService {
    TaskDto createTask(TaskDto taskDto);

    List<TaskDto> getAllTask(String status, Boolean isPublic, String title);
    TaskDto updateTask(Integer taskId, TaskDto taskDto);
    boolean MoveTask (MoveTask moveTask,  Integer taskId);
    TaskDto takeTask(Integer taskId);
    TaskDto cancelTask(Integer taskId);
}
