package com.airline.system.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;

import java.time.OffsetDateTime;

public class FlightStatusHistory {

    private Long historyID;

    @NotBlank(message = "Flight ID is required")
    private String flightID;

    private String previousStatus;

    @NotBlank(message = "New status is required")
    private String newStatus;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private OffsetDateTime changeTimestamp;

    private String remarks;

    public FlightStatusHistory() {
    }

    public FlightStatusHistory(Long historyID, String flightID, String previousStatus,
                               String newStatus, OffsetDateTime changeTimestamp, String remarks) {
        this.historyID = historyID;
        this.flightID = flightID;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.changeTimestamp = changeTimestamp != null ? changeTimestamp : OffsetDateTime.now();
        this.remarks = remarks;
    }

    public FlightStatusHistory(String flightID, String previousStatus,
                               String newStatus, OffsetDateTime changeTimestamp, String remarks) {
        this(null, flightID, previousStatus, newStatus, changeTimestamp, remarks);
    }

    public Long getHistoryID() {
        return historyID;
    }

    public void setHistoryID(Long historyID) {
        this.historyID = historyID;
    }

    public String getFlightID() {
        return flightID;
    }

    public void setFlightID(String flightID) {
        this.flightID = flightID;
    }

    public String getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(String previousStatus) {
        this.previousStatus = previousStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public OffsetDateTime getChangeTimestamp() {
        return changeTimestamp;
    }

    public void setChangeTimestamp(OffsetDateTime changeTimestamp) {
        this.changeTimestamp = changeTimestamp;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
