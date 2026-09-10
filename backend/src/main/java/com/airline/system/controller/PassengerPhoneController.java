package com.airline.system.controller;

import com.airline.system.exception.ApiError;
import com.airline.system.model.PassengerPhone;
import com.airline.system.service.PassengerPhoneService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passenger-phones")
@CrossOrigin(origins = "*")
public class PassengerPhoneController {

    private final PassengerPhoneService passengerPhoneService;

    public PassengerPhoneController(
            PassengerPhoneService passengerPhoneService) {
        this.passengerPhoneService = passengerPhoneService;
    }

    @GetMapping
    public ResponseEntity<List<PassengerPhone>> getAllPhones() {
        return ResponseEntity.ok(
                passengerPhoneService.getAllPhones()
        );
    }

    @GetMapping("/{passengerID}/{phone}")
    public ResponseEntity<?> getPhone(
            @PathVariable String passengerID,
            @PathVariable String phone) {

        PassengerPhone passengerPhone =
                passengerPhoneService.getPhone(
                        passengerID,
                        phone
                );

        if (passengerPhone == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(
                            "Passenger Phone Not Found",
                            "No phone record exists for Passenger ID "
                                    + passengerID
                                    + " and phone "
                                    + phone + "."
                    ));
        }

        return ResponseEntity.ok(passengerPhone);
    }

    @PostMapping
    public ResponseEntity<String> addPhone(
            @Valid @RequestBody PassengerPhone passengerPhone) {

        passengerPhoneService.addPhone(passengerPhone);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Passenger phone added successfully");
    }

    @PutMapping("/{passengerID}/{phone}")
    public ResponseEntity<String> updatePhone(
            @PathVariable String passengerID,
            @PathVariable String phone,
            @Valid @RequestBody PassengerPhone passengerPhone) {

        boolean updated =
                passengerPhoneService.updatePhone(
                        passengerID,
                        phone,
                        passengerPhone
                );

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Passenger phone not found");
        }

        return ResponseEntity.ok(
                "Passenger phone updated successfully"
        );
    }

    @DeleteMapping("/{passengerID}/{phone}")
    public ResponseEntity<String> deletePhone(
            @PathVariable String passengerID,
            @PathVariable String phone) {

        boolean deleted =
                passengerPhoneService.deletePhone(
                        passengerID,
                        phone
                );

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Passenger phone not found");
        }

        return ResponseEntity.ok(
                "Passenger phone deleted successfully"
        );
    }
}