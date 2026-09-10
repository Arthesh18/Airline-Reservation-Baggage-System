package com.airline.system.controller;

import com.airline.system.exception.ApiError;
import com.airline.system.model.BaggageTracking;
import com.airline.system.service.BaggageTrackingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/baggage-tracking")
@CrossOrigin(origins = "*")
public class BaggageTrackingController {

    private final BaggageTrackingService baggageTrackingService;

    public BaggageTrackingController(
            BaggageTrackingService baggageTrackingService) {
        this.baggageTrackingService = baggageTrackingService;
    }

    @GetMapping
    public ResponseEntity<List<BaggageTracking>> getAllTracking() {
        return ResponseEntity.ok(
                baggageTrackingService.getAllTracking()
        );
    }

    @GetMapping("/{baggageID}/{trackingID}")
    public ResponseEntity<?> getTracking(
            @PathVariable String baggageID,
            @PathVariable String trackingID) {

        BaggageTracking tracking =
                baggageTrackingService.getTracking(
                        baggageID,
                        trackingID
                );

        if (tracking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(
                            "Tracking Record Not Found",
                            "No tracking record exists for Baggage ID "
                                    + baggageID
                                    + " and Tracking ID "
                                    + trackingID + "."
                    ));
        }

        return ResponseEntity.ok(tracking);
    }

    @PostMapping
    public ResponseEntity<String> addTracking(
            @Valid @RequestBody BaggageTracking tracking) {

        baggageTrackingService.addTracking(tracking);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Baggage tracking record added successfully");
    }

    @PutMapping("/{baggageID}/{trackingID}")
    public ResponseEntity<String> updateTracking(
            @PathVariable String baggageID,
            @PathVariable String trackingID,
            @Valid @RequestBody BaggageTracking tracking) {

        boolean updated =
                baggageTrackingService.updateTracking(
                        baggageID,
                        trackingID,
                        tracking
                );

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Tracking record not found");
        }

        return ResponseEntity.ok(
                "Baggage tracking record updated successfully"
        );
    }

    @DeleteMapping("/{baggageID}/{trackingID}")
    public ResponseEntity<String> deleteTracking(
            @PathVariable String baggageID,
            @PathVariable String trackingID) {

        boolean deleted =
                baggageTrackingService.deleteTracking(
                        baggageID,
                        trackingID
                );

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Tracking record not found");
        }

        return ResponseEntity.ok(
                "Baggage tracking record deleted successfully"
        );
    }
}