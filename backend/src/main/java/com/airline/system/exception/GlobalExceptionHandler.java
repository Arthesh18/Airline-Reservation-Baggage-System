package com.airline.system.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Duplicate primary key
    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<ApiError> handleDuplicateKey(
            DuplicateKeyException ex) {

        logger.error("Duplicate key error", ex);

        String message = ex.getMostSpecificCause().getMessage();

        String duplicateValue = "the given value";

        if (message != null && message.contains("Duplicate entry")) {
            int start = message.indexOf("'") + 1;
            int end = message.indexOf("'", start);

            if (start > 0 && end > start) {
                duplicateValue = message.substring(start, end);
            }
        }

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiError(
                        "Duplicate Primary Key",
                        "A record with ID " + duplicateValue + " already exists."
                ));
    }

    // Other database constraint errors
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDatabaseError(
            DataIntegrityViolationException ex) {

        logger.error("Database integrity error", ex);

        String message = ex.getMostSpecificCause().getMessage();

        if (message != null) {
            String lower = message.toLowerCase();

            if (lower.contains("cannot delete or update a parent row")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ApiError(
                                "Foreign Key Constraint Violation",
                                "Cannot delete or modify this record because related dependent records exist."
                        ));
            }

            if (lower.contains("cannot add or update a child row")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ApiError(
                                "Invalid Foreign Key",
                                "The operation refers to a record that does not exist."
                        ));
            }

            if (lower.contains("foreign key")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ApiError(
                                "Foreign Key Constraint Violation",
                                "The operation violates a foreign key constraint."
                        ));
            }

            if (lower.contains("constraint")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ApiError(
                                "Database Constraint Error",
                                "The operation violates a database constraint."
                        ));
            }
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiError(
                        "Database Error",
                        "The operation could not be completed because of a database constraint."
                ));
    }

    // Business rule restrictions (e.g. deleting shared airports with active reservations)
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiError> handleIllegalState(IllegalStateException ex) {
        logger.warn("Operation not allowed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiError(
                        "Operation Not Allowed",
                        ex.getMessage()
                ));
    }

    // Validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationError(
            MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Invalid input.");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiError(
                        "Invalid Input",
                        message
                ));
    }

    // Unexpected errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneralError(Exception ex) {

        logger.error("UNEXPECTED SERVER ERROR", ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiError(
                        "Server Error",
                        "Something went wrong while processing the request."
                ));
    }
}
