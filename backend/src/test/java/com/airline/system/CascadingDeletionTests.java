package com.airline.system;

import com.airline.system.dao.*;
import com.airline.system.model.*;
import com.airline.system.service.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CascadingDeletionTests {

    @Autowired
    private PassengerService passengerService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private TicketService ticketService;

    @Autowired
    private BaggageService baggageService;

    @Autowired
    private AirportService airportService;

    @Autowired
    private AirlineService airlineService;

    @Autowired
    private FlightService flightService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PassengerPhoneService passengerPhoneService;

    @Autowired
    private BaggageTrackingService baggageTrackingService;

    @Autowired
    private TicketBaggageService ticketBaggageService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final String TEST_PASSENGER_1 = "P991";
    private final String TEST_PASSENGER_2 = "P992";
    private final String TEST_AIRLINE = "AL99";
    private final String TEST_AIRPORT_1 = "AP91";
    private final String TEST_AIRPORT_2 = "AP92";
    private final String TEST_FLIGHT = "FL99";
    private final String TEST_RES_1 = "R991";
    private final String TEST_RES_2 = "R992";
    private final String TEST_TICKET_1 = "TK91";
    private final String TEST_TICKET_2 = "TK92";
    private final String TEST_BAGGAGE_1 = "BG91";
    private final String TEST_BAGGAGE_2 = "BG92";
    private final String TEST_PAYMENT_1 = "PM91";
    private final String TEST_TRACKING_1 = "TR91";
    private final String TEST_PHONE_1 = "9999900001";
    private final String TEST_PHONE_2 = "9999900002";

    @BeforeEach
    @AfterEach
    void cleanTestData() {
        // Clean up in reverse dependency order
        jdbcTemplate.update("DELETE FROM FLIGHT_STATUS_HISTORY WHERE FlightID = ?", TEST_FLIGHT);
        jdbcTemplate.update("DELETE FROM BAGGAGE_TRACKING WHERE TrackingID = ?", TEST_TRACKING_1);
        jdbcTemplate.update("DELETE FROM TICKET_BAGGAGE WHERE ReservationID IN (?, ?)", TEST_RES_1, TEST_RES_2);
        jdbcTemplate.update("DELETE FROM PAYMENT WHERE PaymentID = ?", TEST_PAYMENT_1);
        jdbcTemplate.update("DELETE FROM TICKET WHERE ReservationID IN (?, ?)", TEST_RES_1, TEST_RES_2);
        jdbcTemplate.update("DELETE FROM RESERVATION WHERE ReservationID IN (?, ?)", TEST_RES_1, TEST_RES_2);
        jdbcTemplate.update("DELETE FROM PASSENGER_PHONE WHERE PassengerID IN (?, ?)", TEST_PASSENGER_1, TEST_PASSENGER_2);
        jdbcTemplate.update("DELETE FROM PASSENGER WHERE PassengerID IN (?, ?)", TEST_PASSENGER_1, TEST_PASSENGER_2);
        jdbcTemplate.update("DELETE FROM BAGGAGE WHERE BaggageID IN (?, ?)", TEST_BAGGAGE_1, TEST_BAGGAGE_2);
        jdbcTemplate.update("DELETE FROM FLIGHT WHERE FlightID = ?", TEST_FLIGHT);
        jdbcTemplate.update("DELETE FROM AIRLINES WHERE AirlineID = ?", TEST_AIRLINE);
        jdbcTemplate.update("DELETE FROM AIRPORT WHERE AirportID IN (?, ?)", TEST_AIRPORT_1, TEST_AIRPORT_2);
    }

    private void seedCompletePassengerGraph() {
        // 1. Airports
        airportService.addAirport(new Airport(TEST_AIRPORT_1, "Test Airport 1", "City A", "Country A"));
        airportService.addAirport(new Airport(TEST_AIRPORT_2, "Test Airport 2", "City B", "Country B"));

        // 2. Airline & Flight
        airlineService.addAirline(new Airline(TEST_AIRLINE, "Test Airline", "TA"));
        flightService.addFlight(new Flight(TEST_FLIGHT, TEST_AIRLINE, LocalTime.of(10, 30)));

        // 3. Passenger 1 (target) & Passenger 2 (unrelated)
        passengerService.addPassenger(new Passenger(TEST_PASSENGER_1, "Target Passenger", "target@test.com",
                LocalDate.of(1990, 1, 1), "123 Street", "City A", "123456"));
        passengerService.addPassenger(new Passenger(TEST_PASSENGER_2, "Other Passenger", "other@test.com",
                LocalDate.of(1995, 5, 5), "456 Avenue", "City B", "654321"));

        // 4. Passenger phones
        passengerPhoneService.addPhone(new PassengerPhone(TEST_PASSENGER_1, TEST_PHONE_1));
        passengerPhoneService.addPhone(new PassengerPhone(TEST_PASSENGER_1, TEST_PHONE_2));

        // 5. Baggage & Baggage Tracking with TIMESTAMPTZ
        baggageService.addBaggage(new Baggage(TEST_BAGGAGE_1, 2, new BigDecimal("23.50")));
        baggageTrackingService.addTracking(new BaggageTracking(TEST_BAGGAGE_1, TEST_TRACKING_1, "Security Scan", OffsetDateTime.now()));

        // 6. Reservation for Passenger 1
        reservationService.addReservation(new Reservation(TEST_RES_1, TEST_PASSENGER_1, "Confirmed", "Economy",
                TEST_AIRPORT_1, TEST_AIRPORT_2));

        // 7. Ticket for Reservation 1
        ticketService.addTicket(new Ticket(TEST_RES_1, TEST_TICKET_1, "14A", new BigDecimal("4500.00")));

        // 8. Payment for Ticket
        paymentService.addPayment(new Payment(TEST_PAYMENT_1, TEST_RES_1, TEST_TICKET_1, new BigDecimal("4500.00"), "Credit Card"));

        // 9. Ticket-Baggage Link
        ticketBaggageService.addTicketBaggage(new TicketBaggage(TEST_RES_1, TEST_TICKET_1, TEST_BAGGAGE_1, LocalDate.now()));
    }

    @Test
    void testPassengerCascadingDeletion() {
        seedCompletePassengerGraph();

        // Verify all entities exist before delete
        assertNotNull(passengerService.getPassenger(TEST_PASSENGER_1));
        assertNotNull(reservationService.getReservation(TEST_RES_1));
        assertNotNull(ticketService.getTicket(TEST_RES_1, TEST_TICKET_1));
        assertNotNull(paymentService.getPayment(TEST_PAYMENT_1));
        assertNotNull(baggageService.getBaggage(TEST_BAGGAGE_1));
        assertNotNull(baggageTrackingService.getTracking(TEST_BAGGAGE_1, TEST_TRACKING_1));
        assertNotNull(ticketBaggageService.getTicketBaggage(TEST_RES_1, TEST_TICKET_1, TEST_BAGGAGE_1));
        assertEquals(2, passengerPhoneService.getAllPhones().stream()
                .filter(p -> p.getPassengerID().equals(TEST_PASSENGER_1)).count());

        // Perform cascading delete of passenger
        boolean deleted = passengerService.deletePassenger(TEST_PASSENGER_1);
        assertTrue(deleted, "Passenger delete operation should succeed");

        // Verify Passenger 1 is deleted
        assertNull(passengerService.getPassenger(TEST_PASSENGER_1), "Passenger should be deleted");

        // Verify dependent records are deleted
        assertEquals(0, passengerPhoneService.getAllPhones().stream()
                .filter(p -> p.getPassengerID().equals(TEST_PASSENGER_1)).count(), "Phone records should be deleted");
        assertNull(reservationService.getReservation(TEST_RES_1), "Reservation should be deleted");
        assertNull(ticketService.getTicket(TEST_RES_1, TEST_TICKET_1), "Ticket should be deleted");
        assertNull(paymentService.getPayment(TEST_PAYMENT_1), "Payment should be deleted");
        assertNull(ticketBaggageService.getTicketBaggage(TEST_RES_1, TEST_TICKET_1, TEST_BAGGAGE_1), "Ticket baggage association should be deleted");
        assertNull(baggageService.getBaggage(TEST_BAGGAGE_1), "Orphaned baggage should be deleted");
        assertNull(baggageTrackingService.getTracking(TEST_BAGGAGE_1, TEST_TRACKING_1), "Baggage tracking should be deleted");

        // Verify unrelated entities remain unchanged
        assertNotNull(passengerService.getPassenger(TEST_PASSENGER_2), "Unrelated passenger P992 must NOT be deleted");
        assertNotNull(airportService.getAirport(TEST_AIRPORT_1), "Shared airport 1 must NOT be deleted");
        assertNotNull(airportService.getAirport(TEST_AIRPORT_2), "Shared airport 2 must NOT be deleted");
        assertNotNull(airlineService.getAirline(TEST_AIRLINE), "Shared airline must NOT be deleted");
        assertNotNull(flightService.getFlight(TEST_FLIGHT), "Shared flight must NOT be deleted");
    }

    @Test
    void testReservationCascadingDeletion() {
        seedCompletePassengerGraph();

        // Delete Reservation 1 directly
        boolean deleted = reservationService.deleteReservation(TEST_RES_1);
        assertTrue(deleted);

        // Verify reservation and its tickets, payments, ticket_baggage, baggage, tracking deleted
        assertNull(reservationService.getReservation(TEST_RES_1));
        assertNull(ticketService.getTicket(TEST_RES_1, TEST_TICKET_1));
        assertNull(paymentService.getPayment(TEST_PAYMENT_1));
        assertNull(ticketBaggageService.getTicketBaggage(TEST_RES_1, TEST_TICKET_1, TEST_BAGGAGE_1));
        assertNull(baggageService.getBaggage(TEST_BAGGAGE_1));
        assertNull(baggageTrackingService.getTracking(TEST_BAGGAGE_1, TEST_TRACKING_1));

        // Passenger MUST NOT be deleted
        assertNotNull(passengerService.getPassenger(TEST_PASSENGER_1), "Parent passenger must remain intact");
        assertEquals(2, passengerPhoneService.getAllPhones().stream()
                .filter(p -> p.getPassengerID().equals(TEST_PASSENGER_1)).count(), "Passenger phones must remain intact");
    }

    @Test
    void testAirportDeletionRestrictionWhenReservationsExist() {
        seedCompletePassengerGraph();

        // Attempting to delete an airport referenced by an existing reservation should throw IllegalStateException
        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            airportService.deleteAirport(TEST_AIRPORT_1);
        });

        assertTrue(ex.getMessage().contains("Cannot delete airport"));
        assertTrue(ex.getMessage().contains("referenced by"));

        // Verify airport is still there
        assertNotNull(airportService.getAirport(TEST_AIRPORT_1));
        assertNotNull(reservationService.getReservation(TEST_RES_1));
    }

    @Test
    void testAirlineDeletionRestrictionWhenFlightsExist() {
        seedCompletePassengerGraph();

        // Attempting to delete an airline referenced by a flight should throw IllegalStateException
        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            airlineService.deleteAirline(TEST_AIRLINE);
        });

        assertTrue(ex.getMessage().contains("Cannot delete airline"));
        assertTrue(ex.getMessage().contains("flight(s) are assigned to it"));

        // Verify airline and flight still exist
        assertNotNull(airlineService.getAirline(TEST_AIRLINE));
        assertNotNull(flightService.getFlight(TEST_FLIGHT));
    }

    @Test
    void testDeleteNonexistentRecords() {
        assertFalse(passengerService.deletePassenger("NON_EXISTENT_ID"));
        assertFalse(reservationService.deleteReservation("NON_EXISTENT_ID"));
        assertFalse(ticketService.deleteTicket("NON_EXISTENT_RES", "NON_EXISTENT_TK"));
        assertFalse(baggageService.deleteBaggage("NON_EXISTENT_ID"));
        assertFalse(airportService.deleteAirport("NON_EXISTENT_ID"));
        assertFalse(airlineService.deleteAirline("NON_EXISTENT_ID"));
        assertFalse(flightService.deleteFlight("NON_EXISTENT_ID"));
        assertFalse(employeeService.deleteEmployee("NON_EXISTENT_ID"));
        assertFalse(paymentService.deletePayment("NON_EXISTENT_ID"));
        assertFalse(baggageTrackingService.deleteTracking("NON_EXISTENT_BG", "NON_EXISTENT_TRK"));
        assertFalse(ticketBaggageService.deleteTicketBaggage("NON_RES", "NON_TK", "NON_BG"));
        assertFalse(passengerPhoneService.deletePhone("NON_EXISTENT_P", "0000000000"));
    }
}
