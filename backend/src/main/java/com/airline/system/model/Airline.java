package com.airline.system.model;

import jakarta.validation.constraints.NotBlank;

public class Airline {

    @NotBlank(message = "Airline ID is required")
    private String airlineID;

    @NotBlank(message = "Airline name is required")
    private String airlineName;

    @NotBlank(message = "IATA code is required")
    private String iataCode;

    public Airline() {
    }

    public Airline(String airlineID, String airlineName, String iataCode) {
        this.airlineID = airlineID;
        this.airlineName = airlineName;
        this.iataCode = iataCode;
    }

    public String getAirlineID() {
        return airlineID;
    }

    public void setAirlineID(String airlineID) {
        this.airlineID = airlineID;
    }

    public String getAirlineName() {
        return airlineName;
    }

    public void setAirlineName(String airlineName) {
        this.airlineName = airlineName;
    }

    public String getIataCode() {
        return iataCode;
    }

    public void setIataCode(String iataCode) {
        this.iataCode = iataCode;
    }
}