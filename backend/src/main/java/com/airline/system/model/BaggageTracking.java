package com.airline.system.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public class BaggageTracking {

    @NotBlank(message = "Baggage ID is required")
    private String baggageID;

    @NotBlank(message = "Tracking ID is required")
    private String trackingID;

    @NotBlank(message = "Scan location is required")
    private String scanLocation;

    @NotNull(message = "Scan time is required")
    private LocalTime scanTime;

    public BaggageTracking() {
    }

    public BaggageTracking(String baggageID, String trackingID,
                           String scanLocation, LocalTime scanTime) {
        this.baggageID = baggageID;
        this.trackingID = trackingID;
        this.scanLocation = scanLocation;
        this.scanTime = scanTime;
    }

    public String getBaggageID() {
        return baggageID;
    }

    public void setBaggageID(String baggageID) {
        this.baggageID = baggageID;
    }

    public String getTrackingID() {
        return trackingID;
    }

    public void setTrackingID(String trackingID) {
        this.trackingID = trackingID;
    }

    public String getScanLocation() {
        return scanLocation;
    }

    public void setScanLocation(String scanLocation) {
        this.scanLocation = scanLocation;
    }

    public LocalTime getScanTime() {
        return scanTime;
    }

    public void setScanTime(LocalTime scanTime) {
        this.scanTime = scanTime;
    }
}