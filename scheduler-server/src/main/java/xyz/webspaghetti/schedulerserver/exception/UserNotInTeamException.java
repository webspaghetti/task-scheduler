package xyz.webspaghetti.schedulerserver.exception;

public class UserNotInTeamException extends RuntimeException {
    public UserNotInTeamException(String message) {
        super(message);
    }
}
