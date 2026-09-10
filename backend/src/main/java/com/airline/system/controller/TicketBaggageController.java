package com.airline.system.controller;

import com.airline.system.exception.ApiError;
import com.airline.system.model.TicketBaggage;
import com.airline.system.service.TicketBaggageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ticket-baggage")
@CrossOrigin(origins = "*")
public class TicketBaggageController {

    private final TicketBaggageService ticketBaggageService;

    public TicketBaggageController(
            TicketBaggageService ticketBaggageService) {
        this.ticketBaggageService = ticketBaggageService;
    }

    @GetMapping
    public ResponseEntity<List<TicketBaggage>> getAllTicketBaggage() {
        return ResponseEntity.ok(
                ticketBaggageService.getAllTicketBaggage()
        );
    }

    @GetMapping("/{reservationID}/{ticketNo}/{baggageID}")
    public ResponseEntity<?> getTicketBaggage(
            @PathVariable String reservationID,
            @PathVariable String ticketNo,
            @PathVariable String baggageID) {

        TicketBaggage record =
                ticketBaggageService.getTicketBaggage(
                        reservationID,
                        ticketNo,
                        baggageID
                );

        if (record == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(
                            "Ticket Baggage Record Not Found",
                            "No record exists for Reservation ID "
                                    + reservationID
                                    + ", Ticket No "
                                    + ticketNo
                                    + " and Baggage ID "
                                    + baggageID + "."
                    ));
        }

        return ResponseEntity.ok(record);
    }

    @PostMapping
    public ResponseEntity<String> addTicketBaggage(
            @Valid @RequestBody TicketBaggage ticketBaggage) {

        ticketBaggageService.addTicketBaggage(ticketBaggage);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Ticket baggage record added successfully");
    }

    @PutMapping("/{reservationID}/{ticketNo}/{baggageID}")
    public ResponseEntity<String> updateTicketBaggage(
            @PathVariable String reservationID,
            @PathVariable String ticketNo,
            @PathVariable String baggageID,
            @Valid @RequestBody TicketBaggage ticketBaggage) {

        boolean updated =
                ticketBaggageService.updateTicketBaggage(
                        reservationID,
                        ticketNo,
                        baggageID,
                        ticketBaggage
                );

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Ticket baggage record not found");
        }

        return ResponseEntity.ok(
                "Ticket baggage record updated successfully"
        );
    }

    @DeleteMapping("/{reservationID}/{ticketNo}/{baggageID}")
    public ResponseEntity<String> deleteTicketBaggage(
            @PathVariable String reservationID,
            @PathVariable String ticketNo,
            @PathVariable String baggageID) {

        boolean deleted =
                ticketBaggageService.deleteTicketBaggage(
                        reservationID,
                        ticketNo,
                        baggageID
                );

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Ticket baggage record not found");
        }

        return ResponseEntity.ok(
                "Ticket baggage record deleted successfully"
        );
    }
}