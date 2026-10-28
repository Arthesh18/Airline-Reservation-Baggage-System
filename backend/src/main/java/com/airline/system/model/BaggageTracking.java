package com.airline.system.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.*;

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

    public BaggageTracking(String baggageID, String trackingID,
                           String scanLocation, String scanTime) {
        this(baggageID, trackingID, scanLocation, parseScanTime(scanTime));
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

    @JsonSetter("scanTime")
    public void setScanTimeString(String rawTime) {
        this.scanTime = parseScanTime(rawTime);
    }

    public static OffsetDateTime parseScanTime(String raw) {
        if (raw == null || raw.trim().isEmpty()) {
            return null;
        }
        String s = raw.trim();

        // 1. Standard ISO-8601 OffsetDateTime: e.g. "2026-10-28T17:43:58+05:30" or "2026-10-28T12:13:58Z"
        try {
            return OffsetDateTime.parse(s);
        } catch (Exception ignored) {}

        // 2. ISO-8601 LocalDateTime: e.g. "2026-10-28T17:43:58" or "2026-10-28T17:43"
        try {
            LocalDateTime ldt = LocalDateTime.parse(s);
            return ldt.atZone(ZoneId.systemDefault()).toOffsetDateTime();
        } catch (Exception ignored) {}

        // 3. Space-separated: e.g. "2026-10-28 17:43:58"
        try {
            String iso = s.replace(' ', 'T');
            LocalDateTime ldt = LocalDateTime.parse(iso);
            return ldt.atZone(ZoneId.systemDefault()).toOffsetDateTime();
        } catch (Exception ignored) {}

        // 4. Time-only: e.g. "17:43:00" or "17:43"
        try {
            LocalTime lt = LocalTime.parse(s);
            return lt.atDate(LocalDate.now()).atZone(ZoneId.systemDefault()).toOffsetDateTime();
        } catch (Exception ignored) {}

        // 5. Instant
        try {
            return Instant.parse(s).atZone(ZoneId.systemDefault()).toOffsetDateTime();
        } catch (Exception ignored) {}

        throw new IllegalArgumentException("Unable to parse scan time: " + raw);
    }
}
