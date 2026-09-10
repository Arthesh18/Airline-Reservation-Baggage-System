package com.airline.system.controller;

import com.airline.system.exception.ApiError;
import com.airline.system.model.Payment;
import com.airline.system.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(
                paymentService.getAllPayments()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPayment(
            @PathVariable String id) {

        Payment payment = paymentService.getPayment(id);

        if (payment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(
                            "Payment Not Found",
                            "No payment exists with ID " + id + "."
                    ));
        }

        return ResponseEntity.ok(payment);
    }

    @PostMapping
    public ResponseEntity<String> addPayment(
            @Valid @RequestBody Payment payment) {

        paymentService.addPayment(payment);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Payment added successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updatePayment(
            @PathVariable String id,
            @Valid @RequestBody Payment payment) {

        boolean updated =
                paymentService.updatePayment(id, payment);

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Payment not found: " + id);
        }

        return ResponseEntity.ok(
                "Payment updated successfully"
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePayment(
            @PathVariable String id) {

        boolean deleted =
                paymentService.deletePayment(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Payment not found: " + id);
        }

        return ResponseEntity.ok(
                "Payment deleted successfully"
        );
    }
}