package com.airline.system.controller;

import com.airline.system.model.Passenger;
import com.airline.system.service.PassengerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin(origins = "*")
public class PassengerController {

    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    // GET all passengers
    @GetMapping
    public ResponseEntity<List<Passenger>> getAllPassengers() {
        return ResponseEntity.ok(passengerService.getAllPassengers());
    }

    // GET passenger by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPassenger(@PathVariable String id) {

        Passenger passenger = passengerService.getPassenger(id);

        if (passenger == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Passenger not found: " + id);
        }

        return ResponseEntity.ok(passenger);
    }

    // ADD passenger
    @PostMapping
    public ResponseEntity<String> addPassenger(
            @Valid @RequestBody Passenger passenger) {

        passengerService.addPassenger(passenger);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Passenger added successfully");
    }

    // UPDATE passenger
    @PutMapping("/{id}")
    public ResponseEntity<String> updatePassenger(
            @PathVariable String id,
            @Valid @RequestBody Passenger passenger) {

        boolean updated = passengerService.updatePassenger(id, passenger);

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Passenger not found: " + id);
        }

        return ResponseEntity.ok("Passenger updated successfully");
    }

    // DELETE passenger
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePassenger(
            @PathVariable String id) {

        boolean deleted = passengerService.deletePassenger(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Passenger not found: " + id);
        }

        return ResponseEntity.ok("Passenger deleted successfully");
    }
}