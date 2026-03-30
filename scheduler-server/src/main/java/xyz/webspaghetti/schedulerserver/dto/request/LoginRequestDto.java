package xyz.webspaghetti.schedulerserver.dto.request;

// Incoming JSON payload from the user's login attempt
public record LoginRequestDto(
        String username,
        String password
) {
}
