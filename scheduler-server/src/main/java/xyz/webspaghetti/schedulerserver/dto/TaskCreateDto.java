package xyz.webspaghetti.schedulerserver.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record TaskCreateDto(

        @NotBlank(message = "Task name is required")
        @Size(max = 50, message = "Task name must be at most 50 characters")
        String name,

        @Size(max = 500, message = "Task description must be at most 500 characters")
        String description,

        @NotNull(message = "Team ID is required")
        @Positive(message = "Team ID must be a positive number")
        Integer teamId
) {
}
