package com.airline.system.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class Payment {

    @NotBlank(message = "Payment ID is required")
    private String paymentID;

    @NotBlank(message = "Reservation ID is required")
    private String reservationID;

    @NotBlank(message = "Ticket number is required")
    private String ticketNo;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    public Payment() {
    }

    public Payment(String paymentID, String reservationID,
                   String ticketNo, BigDecimal amount,
                   String paymentMethod) {
        this.paymentID = paymentID;
        this.reservationID = reservationID;
        this.ticketNo = ticketNo;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentID() {
        return paymentID;
    }

    public void setPaymentID(String paymentID) {
        this.paymentID = paymentID;
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

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}