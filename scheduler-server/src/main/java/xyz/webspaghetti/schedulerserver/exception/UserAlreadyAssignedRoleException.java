package xyz.webspaghetti.schedulerserver.exception;

public class UserAlreadyAssignedRoleException extends RuntimeException {
    public UserAlreadyAssignedRoleException(String message) {
        super(message);
    }
}
