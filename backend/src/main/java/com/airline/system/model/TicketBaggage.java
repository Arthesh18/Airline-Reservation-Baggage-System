package com.airline.system.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class TicketBaggage {

    @NotBlank(message = "Reservation ID is required")
    private String reservationID;

    @NotBlank(message = "Ticket number is required")
    private String ticketNo;

    @NotBlank(message = "Baggage ID is required")
    private String baggageID;

    @NotNull(message = "Checked-in date is required")
    private LocalDate checkedInDate;

    public TicketBaggage() {
    }

    public TicketBaggage(String reservationID, String ticketNo,
                         String baggageID, LocalDate checkedInDate) {
        this.reservationID = reservationID;
        this.ticketNo = ticketNo;
        this.baggageID = baggageID;
        this.checkedInDate = checkedInDate;
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

    public String getBaggageID() {
        return baggageID;
    }

    public void setBaggageID(String baggageID) {
        this.baggageID = baggageID;
    }

    public LocalDate getCheckedInDate() {
        return checkedInDate;
    }

    public void setCheckedInDate(LocalDate checkedInDate) {
        this.checkedInDate = checkedInDate;
    }
}