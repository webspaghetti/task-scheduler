package xyz.webspaghetti.schedulerserver.dto.update;

import jakarta.validation.constraints.NotNull;
import xyz.webspaghetti.schedulerserver.enums.TaskStatus;

import java.time.LocalDateTime;

public record TaskUpdateStatusDto(

        @NotNull(message = "Task status is required")
        TaskStatus status,
        LocalDateTime completedAt
) {
}
