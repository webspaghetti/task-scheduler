package xyz.webspaghetti.schedulerserver.exception;

public class BadUserCredentialsException extends RuntimeException {
    public BadUserCredentialsException(String message) {
        super(message);
    }
}
