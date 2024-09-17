package com.api.exception;

public class TaskNotAvailableException extends  RuntimeException{
    public TaskNotAvailableException(String message) {
        super(message);
    }
}
