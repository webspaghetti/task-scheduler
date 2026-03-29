package xyz.webspaghetti.schedulerserver.dto.response;

import java.util.List;

// What we will be sending to users
public record UserResponseDto(
        Integer id,
        String firstName,
        String lastName,
        String username,
        List<RoleResponseDto> roles
) {
}
