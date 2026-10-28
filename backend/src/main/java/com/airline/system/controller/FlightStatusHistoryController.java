package com.airline.system.controller;

import com.airline.system.exception.ApiError;
import com.airline.system.model.FlightStatusHistory;
import com.airline.system.service.FlightStatusHistoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flight-status-history")
@CrossOrigin(origins = "*")
public class FlightStatusHistoryController {

    private final FlightStatusHistoryService flightStatusHistoryService;

    public FlightStatusHistoryController(FlightStatusHistoryService flightStatusHistoryService) {
        this.flightStatusHistoryService = flightStatusHistoryService;
    }

    @GetMapping
    public ResponseEntity<List<FlightStatusHistory>> getAllStatusHistory() {
        return ResponseEntity.ok(flightStatusHistoryService.getAllStatusHistory());
    }

    @GetMapping("/flight/{flightID}")
    public ResponseEntity<List<FlightStatusHistory>> getHistoryByFlightId(
            @PathVariable String flightID) {
        return ResponseEntity.ok(flightStatusHistoryService.getHistoryByFlightId(flightID));
    }

    @GetMapping("/{historyID}")
    public ResponseEntity<?> getHistoryById(@PathVariable Long historyID) {
        FlightStatusHistory history = flightStatusHistoryService.getHistoryById(historyID);
        if (history == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("History Not Found", "Flight status history record not found for ID: " + historyID));
        }
        return ResponseEntity.ok(history);
    }

    @PostMapping
    public ResponseEntity<String> recordStatusChange(
            @Valid @RequestBody FlightStatusHistory history) {
        flightStatusHistoryService.recordStatusChange(history);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Flight status change recorded successfully");
    }

    @DeleteMapping("/{historyID}")
    public ResponseEntity<?> deleteHistory(@PathVariable Long historyID) {
        boolean deleted = flightStatusHistoryService.deleteHistory(historyID);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("History Not Found", "Flight status history record not found for ID: " + historyID));
        }
        return ResponseEntity.ok("Flight status history record deleted successfully");
    }
}
