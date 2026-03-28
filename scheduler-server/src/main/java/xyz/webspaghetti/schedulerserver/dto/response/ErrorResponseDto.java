package xyz.webspaghetti.schedulerserver.dto.response;

public record ErrorResponseDto(
        int status,
        String message,
        long timestamp
) {
}
