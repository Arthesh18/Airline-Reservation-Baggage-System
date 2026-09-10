package com.airline.system.controller;

import com.airline.system.exception.ApiError;
import com.airline.system.model.Reservation;
import com.airline.system.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(
                reservationService.getAllReservations()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservation(
            @PathVariable String id) {

        Reservation reservation =
                reservationService.getReservation(id);

        if (reservation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(
                            "Reservation Not Found",
                            "No reservation exists with ID " + id + "."
                    ));
        }

        return ResponseEntity.ok(reservation);
    }

    @PostMapping
    public ResponseEntity<String> addReservation(
            @Valid @RequestBody Reservation reservation) {

        reservationService.addReservation(reservation);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Reservation added successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateReservation(
            @PathVariable String id,
            @Valid @RequestBody Reservation reservation) {

        boolean updated =
                reservationService.updateReservation(id, reservation);

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Reservation not found: " + id);
        }

        return ResponseEntity.ok(
                "Reservation updated successfully"
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservation(
            @PathVariable String id) {

        boolean deleted =
                reservationService.deleteReservation(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Reservation not found: " + id);
        }

        return ResponseEntity.ok(
                "Reservation deleted successfully"
        );
    }
}