package com.airline.system.controller;

import com.airline.system.exception.ApiError;
import com.airline.system.model.Flight;
import com.airline.system.service.FlightService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @GetMapping
    public ResponseEntity<List<Flight>> getAllFlights() {
        return ResponseEntity.ok(flightService.getAllFlights());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFlight(@PathVariable String id) {

        Flight flight = flightService.getFlight(id);

        if (flight == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(
                            "Flight Not Found",
                            "No flight exists with ID " + id + "."
                    ));
        }

        return ResponseEntity.ok(flight);
    }

    @PostMapping
    public ResponseEntity<String> addFlight(
            @Valid @RequestBody Flight flight) {

        flightService.addFlight(flight);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Flight added successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateFlight(
            @PathVariable String id,
            @Valid @RequestBody Flight flight) {

        boolean updated = flightService.updateFlight(id, flight);

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Flight not found: " + id);
        }

        return ResponseEntity.ok("Flight updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFlight(
            @PathVariable String id) {

        boolean deleted = flightService.deleteFlight(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Flight not found: " + id);
        }

        return ResponseEntity.ok("Flight deleted successfully");
    }
}