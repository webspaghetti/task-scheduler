package xyz.webspaghetti.schedulerserver.exception;

public class UserNotAssignedToTaskException extends RuntimeException {
    public UserNotAssignedToTaskException(String message) {
        super(message);
    }
}
