package xyz.webspaghetti.schedulerserver.exception;

public class UserNotAssignedRoleException extends RuntimeException {
    public UserNotAssignedRoleException(String message) {
        super(message);
    }
}
