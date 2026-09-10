package com.airline.system.controller;

import com.airline.system.exception.ApiError;
import com.airline.system.model.Ticket;
import com.airline.system.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(
                ticketService.getAllTickets()
        );
    }

    @GetMapping("/{reservationID}/{ticketNo}")
    public ResponseEntity<?> getTicket(
            @PathVariable String reservationID,
            @PathVariable String ticketNo) {

        Ticket ticket = ticketService.getTicket(
                reservationID,
                ticketNo
        );

        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(
                            "Ticket Not Found",
                            "No ticket exists for Reservation ID "
                                    + reservationID
                                    + " and Ticket No "
                                    + ticketNo + "."
                    ));
        }

        return ResponseEntity.ok(ticket);
    }

    @PostMapping
    public ResponseEntity<String> addTicket(
            @Valid @RequestBody Ticket ticket) {

        ticketService.addTicket(ticket);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Ticket added successfully");
    }

    @PutMapping("/{reservationID}/{ticketNo}")
    public ResponseEntity<String> updateTicket(
            @PathVariable String reservationID,
            @PathVariable String ticketNo,
            @Valid @RequestBody Ticket ticket) {

        boolean updated = ticketService.updateTicket(
                reservationID,
                ticketNo,
                ticket
        );

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Ticket not found");
        }

        return ResponseEntity.ok(
                "Ticket updated successfully"
        );
    }

    @DeleteMapping("/{reservationID}/{ticketNo}")
    public ResponseEntity<String> deleteTicket(
            @PathVariable String reservationID,
            @PathVariable String ticketNo) {

        boolean deleted = ticketService.deleteTicket(
                reservationID,
                ticketNo
        );

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Ticket not found");
        }

        return ResponseEntity.ok(
                "Ticket deleted successfully"
        );
    }
}