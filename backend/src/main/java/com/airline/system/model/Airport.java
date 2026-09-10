package com.airline.system.model;

import jakarta.validation.constraints.NotBlank;

public class Airport {

    @NotBlank(message = "Airport ID is required")
    private String airportID;

    @NotBlank(message = "Airport name is required")
    private String airportName;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Country is required")
    private String country;

    public Airport() {
    }

    public Airport(String airportID, String airportName,
                   String city, String country) {
        this.airportID = airportID;
        this.airportName = airportName;
        this.city = city;
        this.country = country;
    }

    public String getAirportID() {
        return airportID;
    }

    public void setAirportID(String airportID) {
        this.airportID = airportID;
    }

    public String getAirportName() {
        return airportName;
    }

    public void setAirportName(String airportName) {
        this.airportName = airportName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}