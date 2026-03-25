package xyz.webspaghetti.schedulerserver.dto;

import java.util.List;

public record TeamResponseDto(
        long id,
        String name,
        List<TaskResponseDto> tasks,
        List<UserResponseDto> users
) {
}
