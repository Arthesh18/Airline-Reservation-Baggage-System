package com.airline.system;

import com.airline.system.controller.AirportController;
import com.airline.system.controller.PassengerController;
import com.airline.system.exception.ApiError;
import com.airline.system.exception.GlobalExceptionHandler;
import com.airline.system.model.Airport;
import com.airline.system.model.Passenger;
import com.airline.system.model.Reservation;
import com.airline.system.service.AirportService;
import com.airline.system.service.PassengerService;
import com.airline.system.service.ReservationService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ControllerDeletionTests {

    @Autowired
    private PassengerController passengerController;

    @Autowired
    private AirportController airportController;

    @Autowired
    private PassengerService passengerService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private AirportService airportService;

    @Autowired
    private GlobalExceptionHandler globalExceptionHandler;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final String P_TEST = "P888";
    private final String R_TEST = "R888";
    private final String AP_TEST1 = "AP81";
    private final String AP_TEST2 = "AP82";

    @BeforeEach
    @AfterEach
    void setup() {
        jdbcTemplate.update("DELETE FROM RESERVATION WHERE ReservationID = ?", R_TEST);
        jdbcTemplate.update("DELETE FROM PASSENGER WHERE PassengerID = ?", P_TEST);
        jdbcTemplate.update("DELETE FROM AIRPORT WHERE AirportID IN (?, ?)", AP_TEST1, AP_TEST2);
    }

    @Test
    void testDeleteNonexistentPassengerReturns404WithApiError() {
        ResponseEntity<?> response = passengerController.deletePassenger("NON_EXISTENT_P");
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof ApiError);
        ApiError apiError = (ApiError) response.getBody();
        assertEquals("Passenger Not Found", apiError.getError());
        assertTrue(apiError.getMessage().contains("Passenger not found: NON_EXISTENT_P"));
    }

    @Test
    void testDeleteAirportRestrictedReturns409ViaExceptionHandler() {
        airportService.addAirport(new Airport(AP_TEST1, "City81 Airport", "City81", "Country81"));
        airportService.addAirport(new Airport(AP_TEST2, "City82 Airport", "City82", "Country82"));
        passengerService.addPassenger(new Passenger(P_TEST, "Test User", "test888@mail.com",
                LocalDate.of(2000, 1, 1), "St", "City", "100000"));
        reservationService.addReservation(new Reservation(R_TEST, P_TEST, "Confirmed", "Economy", AP_TEST1, AP_TEST2));

        // When calling deleteAirport, IllegalStateException is thrown by service
        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            airportController.deleteAirport(AP_TEST1);
        });

        // The GlobalExceptionHandler maps IllegalStateException to HTTP 409 CONFLICT with structured ApiError
        ResponseEntity<ApiError> errResponse = globalExceptionHandler.handleIllegalState(ex);
        assertEquals(HttpStatus.CONFLICT, errResponse.getStatusCode());
        assertEquals("Operation Not Allowed", errResponse.getBody().getError());
        assertTrue(errResponse.getBody().getMessage().contains("Cannot delete airport " + AP_TEST1));
    }

    @Test
    void testDeletePassengerSuccessReturns200() {
        passengerService.addPassenger(new Passenger(P_TEST, "Test User", "test888@mail.com",
                LocalDate.of(2000, 1, 1), "St", "City", "100000"));

        ResponseEntity<?> response = passengerController.deletePassenger(P_TEST);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Passenger deleted successfully", response.getBody());
    }
}
