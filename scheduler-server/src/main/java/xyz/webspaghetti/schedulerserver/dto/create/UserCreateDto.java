package xyz.webspaghetti.schedulerserver.dto.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// When creating users we use this
public record UserCreateDto(

        @NotBlank(message = "First name is required")
        @Size(max = 30, message = "First name must be at most 30 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 30, message = "Last name must be at most 30 characters")
        String lastName,

        @NotBlank(message = "Username is required")
        @Size(max = 50, message = "Username must be at most 50 characters")
        String username,

        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 80, message = "Password must be between 6 and 80 characters")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*]).*$",
                message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
        )
        String password
) {}
