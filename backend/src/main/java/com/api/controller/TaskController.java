package com.api.controller;


import com.api.dto.MoveTask;
import com.api.dto.TaskDto;
import com.api.exception.ResourceNotFoundException;
import com.api.exception.TaskNotAvailableException;
import com.api.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping("/task")
    public TaskDto createTask(@RequestBody TaskDto taskDto) {
        System.out.println("Task Dto"+ taskDto.toString());
        return taskService.createTask(taskDto);
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDto>> getAllTasks (@RequestParam("status") String status, @RequestParam("isPublic") Boolean isPublic, @RequestParam( required = false) String title) {
        List<TaskDto> taskDto = taskService.getAllTask(status, isPublic, title);
        return ResponseEntity.ok(taskDto);
    }

    @PutMapping("/task/{id}")
    public  ResponseEntity<TaskDto> updateTaskId (@PathVariable("id") Integer taskId, @RequestBody TaskDto taskDto) {
        TaskDto updateTask = taskService.updateTask(taskId, taskDto);
        return  ResponseEntity.ok(updateTask);
    }

    @PutMapping("/move/{taskId}")
    public ResponseEntity<String> moveTask(@PathVariable Integer taskId, @RequestBody MoveTask moveTaskDto) {
        try {
            boolean success = taskService.MoveTask(moveTaskDto, taskId);
            if (success) {
                return new ResponseEntity<>("Task moved successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("Failed to move task", HttpStatus.BAD_REQUEST);
        } catch (TaskNotAvailableException e) {
            return new ResponseEntity<>("Private task cannot be taken by another user", HttpStatus.FORBIDDEN);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>("Group task cannot be changed to private", HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return handleException(e);
        }
    }

    private ResponseEntity<String> handleException(Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PutMapping("/task/take/{taskId}")
    public ResponseEntity<?> takeTask(@PathVariable Integer taskId) {
        try {
            TaskDto taskDto = taskService.takeTask(taskId);
            return new ResponseEntity<>(taskDto, HttpStatus.OK);
        } catch (ResourceNotFoundException | IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/task/cancel/{taskId}")
    public ResponseEntity<?> cancelTask(@PathVariable Integer taskId) {
        try {
            TaskDto taskDto = taskService.cancelTask(taskId);
            return new ResponseEntity<>(taskDto, HttpStatus.OK);
        } catch (ResourceNotFoundException | IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
