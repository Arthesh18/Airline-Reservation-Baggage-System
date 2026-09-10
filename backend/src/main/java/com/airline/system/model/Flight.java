package com.airline.system.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public class Flight {

    @NotBlank(message = "Flight ID is required")
    private String flightID;

    @NotBlank(message = "Airline ID is required")
    private String airlineID;

    @NotNull(message = "Departure time is required")
    private LocalTime departureTime;

    public Flight() {
    }

    public Flight(String flightID, String airlineID,
                  LocalTime departureTime) {
        this.flightID = flightID;
        this.airlineID = airlineID;
        this.departureTime = departureTime;
    }

    public String getFlightID() {
        return flightID;
    }

    public void setFlightID(String flightID) {
        this.flightID = flightID;
    }

    public String getAirlineID() {
        return airlineID;
    }

    public void setAirlineID(String airlineID) {
        this.airlineID = airlineID;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }
}