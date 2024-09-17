package com.api.service.impl;

import com.api.dto.MoveTask;
import com.api.dto.TaskDto;
import com.api.entity.From;
import com.api.entity.Task;
import com.api.entity.User;
import com.api.exception.ResourceNotFoundException;
import com.api.mapper.TaskMapper;
import com.api.repository.TaskRepo;
import com.api.repository.UserRepo;
import com.api.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class TaskServiceImpl implements TaskService {
    @Autowired
    UserRepo userRepo;

    @Autowired
    TaskRepo taskRepo;


    private final static String TASK_CREATED_SUCCESSFULLY = "Task created successfully";
    private final static String TASK_UPDATED_SUCCESSFULLY = "Task updated successfully";
    private final static String TASK_NOT_FOUND = "Task not found with id: {null}";
    private final static String TASK_TAKEN_SUCCESSFULLY = "Task taken successfully";
    private final static String TASK_TAKEN_BY_ANOTHER_USER = "Private task cannot be taken by another user";
    private final static String GROUP_TASK_CANNOT_BE_CHANGED_TO_PRIVATE = "Group task cannot be changed to private";

    @Override
    public TaskDto createTask(TaskDto taskDto) {
        Task task = TaskMapper.mapToTask(taskDto);
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String currentUserEmail = userDetails.getUsername();
        User currentUser = userRepo.findByEmail(currentUserEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not logged in: " + currentUserEmail));
        if(taskDto.getIsPublic()) {
            task.setCreateUser(currentUser);
        } else  {
            task.setCreateUser(currentUser);
            task.setAssignedUser(currentUser);
        }
        if (task.getIsPublic() == null) {
            task.setIsPublic(false);
        }
        Integer maxPosition = taskRepo.findMaxPositionByStatus(task.getFrom());
        task.setPosition(maxPosition != null ? maxPosition + 1 : 0);
        Task savedTask = taskRepo.save(task);
        return TaskMapper.mapToTaskDto(savedTask);
    }

    @Override
    public List<TaskDto> getAllTask(String status, Boolean isPublic, String title) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String currentUserEmail = userDetails.getUsername();
        List<Task> tasks = new ArrayList<>();
        if(isPublic) {
            tasks = taskRepo.findByPublicTask(From.valueOf(status), title);
        } else  {
             tasks =taskRepo.findByPrivateTask(From.valueOf(status), currentUserEmail, title);
        }
        return  tasks.stream().map(TaskMapper::mapToTaskDto).collect(Collectors.toList());
    }

    @Override
    public TaskDto updateTask(Integer taskId, TaskDto taskDto) {
        Task existingTask = taskRepo.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));
        if (taskDto.getTitle() != null) {
            existingTask.setTitle(taskDto.getTitle());
        }
        if (taskDto.getDescription() != null) {
            existingTask.setDescription(taskDto.getDescription());
        }
        if (taskDto.getDueDate() != null) {
            existingTask.setDueDate(taskDto.getDueDate());
        }
        if (taskDto.getFrom() != null) {
            existingTask.setFrom(From.valueOf(taskDto.getFrom()));
        }
        if (taskDto.getIsPublic() != null) {
            existingTask.setIsPublic(taskDto.getIsPublic());
        }
        if (taskDto.getPosition() != null) {
            existingTask.setPosition(taskDto.getPosition());
        }
        if (taskDto.getCreateUserId() != null) {
            User createUser = userRepo.findById(taskDto.getCreateUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + taskDto.getCreateUserId()));
            existingTask.setCreateUser(createUser);
        }
        if (taskDto.getAssignedUserId() != null) {
            User assignedUser = userRepo.findById(taskDto.getAssignedUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + taskDto.getAssignedUserId()));
            existingTask.setAssignedUser(assignedUser);
        }
        Task updatedTask = taskRepo.save(existingTask);
        return TaskMapper.mapToTaskDto(updatedTask);
    }

    // MoVeTask
    @Override
    public boolean MoveTask(MoveTask moveTask, Integer taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        int newPosition = moveTask.getOverPosition();
        From newStatus = moveTask.getOverStatus();
        updateTaskStatusAndPosition(task, newPosition, newStatus);
        return true;
    }
    private void updateTaskStatusAndPosition(Task task, int newPosition, From newStatus) {
        // Check if moving within the same column
        if (task.getFrom().equals(newStatus)) {
            // Update position within the same column
            updateTaskPosition(task.getPosition(), newPosition, task.getFrom());
            task.setPosition(newPosition);
           } else {
            // Update tasks in the old column
            updateTaskPosition(task.getPosition(), null, task.getFrom());
            // Update task's status and position
            updateTaskPosition(null, newPosition, newStatus);
            task.setPosition(newPosition);
            task.setFrom(newStatus);
            // Update tasks in the new column
        }
        taskRepo.save(task);
    }
    private void updateTaskPosition(Integer currentPosition, Integer newPosition, From status) {
        List<Task> tasksInColumn = taskRepo.findByFrom(status);
        if (newPosition != null) {
            if (currentPosition == null) {
                // Moving a new task into the column
                for (Task t : tasksInColumn) {
                    if (t.getPosition() >= newPosition) {
                        t.setPosition(t.getPosition() + 1);
                        taskRepo.save(t);
                    }
                }
            } else if (currentPosition < newPosition) {
                // Moving task down
                for (Task t : tasksInColumn) {
                    if (t.getPosition() > currentPosition && t.getPosition() <= newPosition) {
                        t.setPosition(t.getPosition() - 1);
                        taskRepo.save(t);
                    }
                }
            } else if (currentPosition > newPosition) {
                // Moving task up
                for (Task t : tasksInColumn) {
                    if (t.getPosition() >= newPosition && t.getPosition() < currentPosition) {
                        t.setPosition(t.getPosition() + 1);
                        taskRepo.save(t);
                    }
                }
            }
        } else {
            // Removing task or updating position in the same column
            for (Task t : tasksInColumn) {
                if (t.getPosition() > currentPosition) {
                    t.setPosition(t.getPosition() - 1);
                    taskRepo.save(t);
                }
            }
        }
    }

    //    TakeTask
    @Override
    public TaskDto takeTask(Integer taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(TASK_NOT_FOUND, taskId)));
        if (task.getAssignedUser() != null) {
            throw new IllegalArgumentException(TASK_TAKEN_BY_ANOTHER_USER);
        }
//        task.setFrom(From.TO_DO_LIST);
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();
        User currentUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        task.setAssignedUser(currentUser);
        Task updatedTask = taskRepo.save(task);
        return TaskMapper.mapToTaskDto(updatedTask);
    }

    public TaskDto cancelTask(Integer taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Task not found with ID: %d", taskId)));
        if (task.getAssignedUser() == null) {
            throw new IllegalArgumentException("Task is not currently assigned to any user.");
        }
        // Remove the assignment
        task.setAssignedUser(null);
        Task updatedTask = taskRepo.save(task);
        return TaskMapper.mapToTaskDto(updatedTask);
    }
}
