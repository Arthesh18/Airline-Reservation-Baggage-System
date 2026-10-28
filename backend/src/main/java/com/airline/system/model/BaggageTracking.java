package com.airline.system.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;

public class BaggageTracking {

    @NotBlank(message = "Baggage ID is required")
    private String baggageID;

    @NotBlank(message = "Tracking ID is required")
    private String trackingID;

    @NotBlank(message = "Scan location is required")
    private String scanLocation;

    @NotNull(message = "Scan time is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private OffsetDateTime scanTime;

    public BaggageTracking() {
    }

    public BaggageTracking(String baggageID, String trackingID,
                           String scanLocation, OffsetDateTime scanTime) {
        this.baggageID = baggageID;
        this.trackingID = trackingID;
        this.scanLocation = scanLocation;
        this.scanTime = scanTime != null ? scanTime : OffsetDateTime.now();
    }

    /**
     * Backwards-compatible constructor converting LocalTime to OffsetDateTime with current date.
     */
    public BaggageTracking(String baggageID, String trackingID,
                           String scanLocation, LocalTime scanTime) {
        this(baggageID, trackingID, scanLocation,
                scanTime != null
                        ? scanTime.atDate(LocalDate.now()).atZone(ZoneId.systemDefault()).toOffsetDateTime()
                        : OffsetDateTime.now());
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

    public OffsetDateTime getScanTime() {
        return scanTime;
    }

    public void setScanTime(OffsetDateTime scanTime) {
        this.scanTime = scanTime;
    }
}
