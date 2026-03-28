package xyz.webspaghetti.schedulerserver.exception;

public class UserAlreadyInTeamException extends RuntimeException {
    public UserAlreadyInTeamException(String message) {
        super(message);
    }
}
