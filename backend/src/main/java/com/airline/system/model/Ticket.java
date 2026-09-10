package com.airline.system.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class Ticket {

    @NotBlank(message = "Reservation ID is required")
    private String reservationID;

    @NotBlank(message = "Ticket number is required")
    private String ticketNo;

    private String seatNo;

    @NotNull(message = "Fare is required")
    private BigDecimal fare;

    public Ticket() {
    }

    public Ticket(String reservationID, String ticketNo,
                  String seatNo, BigDecimal fare) {
        this.reservationID = reservationID;
        this.ticketNo = ticketNo;
        this.seatNo = seatNo;
        this.fare = fare;
    }

    public String getReservationID() {
        return reservationID;
    }

    public void setReservationID(String reservationID) {
        this.reservationID = reservationID;
    }

    public String getTicketNo() {
        return ticketNo;
    }

    public void setTicketNo(String ticketNo) {
        this.ticketNo = ticketNo;
    }

    public String getSeatNo() {
        return seatNo;
    }

    public void setSeatNo(String seatNo) {
        this.seatNo = seatNo;
    }

    public BigDecimal getFare() {
        return fare;
    }

    public void setFare(BigDecimal fare) {
        this.fare = fare;
    }
}