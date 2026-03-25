package xyz.webspaghetti.schedulerserver.dto;

// What we will be sending to users
public record UserResponseDto(
        int id,
        String firstName,
        String lastName,
        String username
) {
}
