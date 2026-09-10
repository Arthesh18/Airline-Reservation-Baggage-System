package com.airline.system.controller;

import com.airline.system.exception.ApiError;
import com.airline.system.model.Airport;
import com.airline.system.service.AirportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
@CrossOrigin(origins = "*")
public class AirportController {

    private final AirportService airportService;

    public AirportController(AirportService airportService) {
        this.airportService = airportService;
    }

    @GetMapping
    public ResponseEntity<List<Airport>> getAllAirports() {
        return ResponseEntity.ok(airportService.getAllAirports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAirport(@PathVariable String id) {

        Airport airport = airportService.getAirport(id);

        if (airport == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(
                            "Airport Not Found",
                            "No airport exists with ID " + id + "."
                    ));
        }

        return ResponseEntity.ok(airport);
    }

    @PostMapping
    public ResponseEntity<String> addAirport(
            @Valid @RequestBody Airport airport) {

        airportService.addAirport(airport);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Airport added successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateAirport(
            @PathVariable String id,
            @Valid @RequestBody Airport airport) {

        boolean updated = airportService.updateAirport(id, airport);

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Airport not found: " + id);
        }

        return ResponseEntity.ok("Airport updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAirport(
            @PathVariable String id) {

        boolean deleted = airportService.deleteAirport(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Airport not found: " + id);
        }

        return ResponseEntity.ok("Airport deleted successfully");
    }
}