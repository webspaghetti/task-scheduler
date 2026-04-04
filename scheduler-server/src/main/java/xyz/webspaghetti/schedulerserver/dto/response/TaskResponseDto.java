package xyz.webspaghetti.schedulerserver.dto.response;

import xyz.webspaghetti.schedulerserver.enums.TaskStatus;

import java.time.LocalDateTime;
import java.util.Set;

public record TaskResponseDto(
        Integer id,
        String name,
        String description,
        Integer teamId,
        TaskStatus status,
        LocalDateTime createdAt,
        LocalDateTime completedAt,
        Set<UserResponseDto> users
) {
}
