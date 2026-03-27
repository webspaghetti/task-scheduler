package xyz.webspaghetti.schedulerserver.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record TeamCreateDto(

        @NotBlank(message = "Team name is required")
        @Size(max = 50, message = "Team name must be at most 50 characters")
        String name,

        @NotNull(message = "User ID is required")
        @Positive(message = "User ID must be a positive number")
        Integer userId
) {
}
