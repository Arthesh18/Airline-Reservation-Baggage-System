package com.airline.system.controller;

import com.airline.system.model.Airline;
import com.airline.system.service.AirlineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airlines")
@CrossOrigin(origins = "*")
public class AirlineController {

    private final AirlineService airlineService;

    public AirlineController(AirlineService airlineService) {
        this.airlineService = airlineService;
    }

    @GetMapping
    public ResponseEntity<List<Airline>> getAllAirlines() {
        return ResponseEntity.ok(airlineService.getAllAirlines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAirline(@PathVariable String id) {

        Airline airline = airlineService.getAirline(id);

        if (airline == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new com.airline.system.exception.ApiError(
                            "Airline Not Found",
                            "No airline exists with ID " + id + "."
                    ));
        }

        return ResponseEntity.ok(airline);
    }

    @PostMapping
    public ResponseEntity<String> addAirline(
            @Valid @RequestBody Airline airline) {

        airlineService.addAirline(airline);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Airline added successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateAirline(
            @PathVariable String id,
            @Valid @RequestBody Airline airline) {

        boolean updated = airlineService.updateAirline(id, airline);

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Airline not found: " + id);
        }

        return ResponseEntity.ok("Airline updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAirline(
            @PathVariable String id) {

        boolean deleted = airlineService.deleteAirline(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Airline not found: " + id);
        }

        return ResponseEntity.ok("Airline deleted successfully");
    }
}