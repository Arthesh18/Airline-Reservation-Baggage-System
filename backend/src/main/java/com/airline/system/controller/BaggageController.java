package com.airline.system.controller;

import com.airline.system.exception.ApiError;
import com.airline.system.model.Baggage;
import com.airline.system.service.BaggageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/baggage")
@CrossOrigin(origins = "*")
public class BaggageController {

    private final BaggageService baggageService;

    public BaggageController(BaggageService baggageService) {
        this.baggageService = baggageService;
    }

    @GetMapping
    public ResponseEntity<List<Baggage>> getAllBaggage() {
        return ResponseEntity.ok(baggageService.getAllBaggage());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBaggage(@PathVariable String id) {

        Baggage baggage = baggageService.getBaggage(id);

        if (baggage == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(
                            "Baggage Not Found",
                            "No baggage exists with ID " + id + "."
                    ));
        }

        return ResponseEntity.ok(baggage);
    }

    @PostMapping
    public ResponseEntity<String> addBaggage(
            @Valid @RequestBody Baggage baggage) {

        baggageService.addBaggage(baggage);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Baggage added successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateBaggage(
            @PathVariable String id,
            @Valid @RequestBody Baggage baggage) {

        boolean updated = baggageService.updateBaggage(id, baggage);

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Baggage not found: " + id);
        }

        return ResponseEntity.ok("Baggage updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBaggage(
            @PathVariable String id) {

        boolean deleted = baggageService.deleteBaggage(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Baggage not found: " + id);
        }

        return ResponseEntity.ok("Baggage deleted successfully");
    }
}