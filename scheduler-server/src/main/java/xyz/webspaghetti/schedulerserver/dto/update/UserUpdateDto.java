package xyz.webspaghetti.schedulerserver.dto.update;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserUpdateDto(

        @NotBlank(message = "First name is required")
        @Size(max = 30, message = "First name must be at most 30 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 30, message = "Last name must be at most 30 characters")
        String lastName
) {
}
