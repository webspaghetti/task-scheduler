package xyz.webspaghetti.schedulerserver.dto.response;

import java.time.Instant;

public record ActionHistoryResponseDto(

        Instant timestamp,
        String message
) {
}
