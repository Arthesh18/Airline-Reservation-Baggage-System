package com.airline.system.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class Baggage {

    @NotBlank(message = "Baggage ID is required")
    private String baggageID;

    @NotNull(message = "Number of pieces is required")
    private Integer noOfPieces;

    @NotNull(message = "Weight is required")
    private BigDecimal weight;

    public Baggage() {
    }

    public Baggage(String baggageID, Integer noOfPieces, BigDecimal weight) {
        this.baggageID = baggageID;
        this.noOfPieces = noOfPieces;
        this.weight = weight;
    }

    public String getBaggageID() {
        return baggageID;
    }

    public void setBaggageID(String baggageID) {
        this.baggageID = baggageID;
    }

    public Integer getNoOfPieces() {
        return noOfPieces;
    }

    public void setNoOfPieces(Integer noOfPieces) {
        this.noOfPieces = noOfPieces;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }
}