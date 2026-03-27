package xyz.webspaghetti.schedulerserver.dto.response;

import java.util.List;

public record TeamResponseDto(
        Integer id,
        String name,
        List<TaskResponseDto> tasks,
        List<UserResponseDto> users
) {
}
