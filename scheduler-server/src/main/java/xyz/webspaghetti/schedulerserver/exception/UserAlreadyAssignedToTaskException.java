package xyz.webspaghetti.schedulerserver.exception;

public class UserAlreadyAssignedToTaskException extends RuntimeException {
    public UserAlreadyAssignedToTaskException(String message) {
        super(message);
    }
}
