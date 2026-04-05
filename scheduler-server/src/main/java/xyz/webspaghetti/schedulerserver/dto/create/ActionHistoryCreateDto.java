package xyz.webspaghetti.schedulerserver.dto.create;

import jakarta.validation.constraints.NotBlank;

public record ActionHistoryCreateDto(

        @NotBlank(message = "History message is required")
        String message
) {
}
