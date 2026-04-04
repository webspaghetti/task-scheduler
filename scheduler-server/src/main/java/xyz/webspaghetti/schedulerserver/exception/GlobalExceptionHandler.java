package xyz.webspaghetti.schedulerserver.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import xyz.webspaghetti.schedulerserver.dto.response.ErrorResponseDto;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleEntityNotFound(EntityNotFoundException e) {

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(
                HttpStatus.NOT_FOUND.value(),
                e.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(errorResponseDto, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotInTeamException.class)
    public ResponseEntity<ErrorResponseDto> handleUserNotInTeam(UserNotInTeamException e) {

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                e.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(errorResponseDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserAlreadyInTeamException.class)
    public ResponseEntity<ErrorResponseDto> handleUserAlreadyInTeam(UserAlreadyInTeamException e) {

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(
                HttpStatus.CONFLICT.value(),
                e.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(errorResponseDto, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserNotAssignedToTaskException.class)
    public ResponseEntity<ErrorResponseDto> handleUserNotAssignedToTask(UserNotAssignedToTaskException e) {

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                e.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(errorResponseDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserAlreadyAssignedToTaskException.class)
    public ResponseEntity<ErrorResponseDto> handleUserAlreadyAssignedToTask(UserAlreadyAssignedToTaskException e) {

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(
                HttpStatus.CONFLICT.value(),
                e.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(errorResponseDto, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserAlreadyAssignedRoleException.class)
    public ResponseEntity<ErrorResponseDto> handleUserAlreadyAssignedRole(UserAlreadyAssignedRoleException e) {

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(
                HttpStatus.CONFLICT.value(),
                e.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(errorResponseDto, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserNotAssignedRoleException.class)
    public ResponseEntity<ErrorResponseDto> handleUserNotAssignedRole(UserNotAssignedRoleException e) {

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(
                HttpStatus.CONFLICT.value(),
                e.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(errorResponseDto, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handleUsernameAlreadyExists(UsernameAlreadyExistsException e) {

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(
                HttpStatus.CONFLICT.value(),
                e.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(errorResponseDto, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(BadUserCredentialsException.class)
    public ResponseEntity<ErrorResponseDto> handleBadUserCredentials(BadUserCredentialsException e) {

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                e.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(errorResponseDto, HttpStatus.UNAUTHORIZED);
    }

    // For failing @Valid check
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationExceptions(MethodArgumentNotValidException ex) {

        // Extract all validation errors and combine them into a single string
        List<String> errors = new ArrayList<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.add(error.getDefaultMessage())
        );

        String combinedErrors = String.join(". ", errors);

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed - " + combinedErrors, // Passing the combined errors as the message
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(errorResponseDto, HttpStatus.BAD_REQUEST);
    }

    // For catching unreadable inputs
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDto> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                "Malformed JSON request",
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(errorResponseDto, HttpStatus.BAD_REQUEST);
    }
}
