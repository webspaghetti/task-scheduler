package xyz.webspaghetti.schedulerserver.dto;

import java.time.LocalDateTime;
import java.util.Set;

public record TaskResponseDto(
        Integer id,
        String name,
        String description,
        Integer teamId,
        String status,
        LocalDateTime createdAt,
        LocalDateTime completedAt,
        Set<UserResponseDto> users
) {
}
