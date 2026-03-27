package xyz.webspaghetti.schedulerserver.dto.update;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TeamUpdateDto(

        @NotBlank(message = "Team name is required")
        @Size(max = 50, message = "Team name must be at most 50 characters")
        String name
) {
}
