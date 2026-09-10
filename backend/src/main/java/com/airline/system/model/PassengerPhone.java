package com.airline.system.model;

import jakarta.validation.constraints.NotBlank;

public class PassengerPhone {

    @NotBlank(message = "Passenger ID is required")
    private String passengerID;

    @NotBlank(message = "Phone is required")
    private String phone;

    public PassengerPhone() {
    }

    public PassengerPhone(String passengerID, String phone) {
        this.passengerID = passengerID;
        this.phone = phone;
    }

    public String getPassengerID() {
        return passengerID;
    }

    public void setPassengerID(String passengerID) {
        this.passengerID = passengerID;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}