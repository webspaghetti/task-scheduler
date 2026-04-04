package xyz.webspaghetti.schedulerserver.dto.update;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import xyz.webspaghetti.schedulerserver.enums.TaskStatus;

public record TaskUpdateDto(

        @NotBlank(message = "Task name is required")
        @Size(max = 50, message = "Task name must be at most 50 characters")
        String name,

        @Size(max = 500, message = "Task description must be at most 500 characters")
        String description,

        @NotBlank(message = "Task status is required")
        TaskStatus status
) {
}
