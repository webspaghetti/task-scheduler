package xyz.webspaghetti.schedulerserver.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import xyz.webspaghetti.schedulerserver.dto.create.TaskCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.TaskResponseDto;
import xyz.webspaghetti.schedulerserver.dto.update.TaskUpdateDto;
import xyz.webspaghetti.schedulerserver.service.TaskService;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;


    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    // Find a Task
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponseDto> getTask(
            @PathVariable Integer taskId
    ) {

        TaskResponseDto fetchedTask = taskService.findTaskById(taskId);

        return ResponseEntity.ok(fetchedTask);
    }

    // Find all Tasks in a Team
    @GetMapping("/teams/{teamId}")
    public ResponseEntity<List<TaskResponseDto>> getTasksInTeam(
            @PathVariable Integer teamId
    ) {

        List<TaskResponseDto> teamTasksList = taskService.findAllTasksInTeam(teamId);

        return ResponseEntity.ok(teamTasksList);
    }

    // Find all Task for User in a Team
    @GetMapping("/teams/{teamId}/users/{userId}")
    public ResponseEntity<List<TaskResponseDto>> getTasksForUserInTeam(
            @PathVariable Integer teamId,
            @PathVariable Integer userId
    ) {

        List<TaskResponseDto> usersTasksInTeamList = taskService.findTasksForUserInTeam(userId, teamId);

        return ResponseEntity.ok(usersTasksInTeamList);
    }

    // Create a Task
    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(
            @RequestBody @Valid TaskCreateDto taskCreateDto
    ) {

        TaskResponseDto createdTask = taskService.createTask(taskCreateDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    // Update a Task
    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponseDto> updateTask(
            @PathVariable Integer taskId,
            @RequestBody @Valid TaskUpdateDto taskUpdateDto
    ) {

        TaskResponseDto updatedTask = taskService.updateTask(taskId, taskUpdateDto);

        return ResponseEntity.ok(updatedTask);
    }

    // Delete a Task
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Integer taskId
    ) {

        taskService.deleteTask(taskId);

        return ResponseEntity.noContent().build();
    }

    // Assign User to a Task
    @PostMapping("/{taskId}/users/{userId}")
    public ResponseEntity<String> addUserToTask(
            @PathVariable Integer taskId,
            @PathVariable Integer userId
    ) {

        taskService.addUserToTask(userId, taskId);

        return ResponseEntity.ok("User {" + userId + "} successfully assigned to Task {" + taskId + "}");
    }

    // Remove User from a Task
    @DeleteMapping("/{taskId}/users/{userId}")
    public ResponseEntity<String> removeUserFromTask(
            @PathVariable Integer taskId,
            @PathVariable Integer userId
    ) {

        taskService.removeUserFromTask(userId, taskId);

        return ResponseEntity.ok("User {" + userId + "} successfully removed from Task {" + taskId + "}");
    }
}
