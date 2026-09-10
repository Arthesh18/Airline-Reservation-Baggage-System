package com.airline.system.model;

import jakarta.validation.constraints.NotBlank;

public class Reservation {

    @NotBlank(message = "Reservation ID is required")
    private String reservationID;

    @NotBlank(message = "Passenger ID is required")
    private String passengerID;

    @NotBlank(message = "Booking status is required")
    private String bookingStatus;

    @NotBlank(message = "Class is required")
    private String reservationClass;

    @NotBlank(message = "Departure airport ID is required")
    private String departureAirportID;

    @NotBlank(message = "Arrival airport ID is required")
    private String arrivalAirportID;

    public Reservation() {
    }

    public Reservation(String reservationID, String passengerID,
                       String bookingStatus, String reservationClass,
                       String departureAirportID, String arrivalAirportID) {
        this.reservationID = reservationID;
        this.passengerID = passengerID;
        this.bookingStatus = bookingStatus;
        this.reservationClass = reservationClass;
        this.departureAirportID = departureAirportID;
        this.arrivalAirportID = arrivalAirportID;
    }

    public String getReservationID() {
        return reservationID;
    }

    public void setReservationID(String reservationID) {
        this.reservationID = reservationID;
    }

    public String getPassengerID() {
        return passengerID;
    }

    public void setPassengerID(String passengerID) {
        this.passengerID = passengerID;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public String getReservationClass() {
        return reservationClass;
    }

    public void setReservationClass(String reservationClass) {
        this.reservationClass = reservationClass;
    }

    public String getDepartureAirportID() {
        return departureAirportID;
    }

    public void setDepartureAirportID(String departureAirportID) {
        this.departureAirportID = departureAirportID;
    }

    public String getArrivalAirportID() {
        return arrivalAirportID;
    }

    public void setArrivalAirportID(String arrivalAirportID) {
        this.arrivalAirportID = arrivalAirportID;
    }
}