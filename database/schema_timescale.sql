-- =============================================================================
-- Airline Reservation & Baggage Tracking System
-- Target: TimescaleDB (PostgreSQL)
-- File: database/schema_timescale.sql
-- Description: Complete PostgreSQL / TimescaleDB schema definition.
--              - BAGGAGE_TRACKING is configured as a TimescaleDB hypertable
--                partitioned along ScanTime (TIMESTAMPTZ).
--              - FLIGHT_STATUS_HISTORY is maintained as a standard PostgreSQL
--                relational table with foreign key integrity to FLIGHT.
--              - All tables and constraints are created in foreign-key-safe order.
-- =============================================================================

-- Enable TimescaleDB extension if not already present
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- -----------------------------------------------------------------------------
-- Note on Database / Schema Selection:
-- In Timescale Cloud, database selection is managed at connection time (e.g. tsdb).
-- (Optional) If isolating within a dedicated schema namespace:
--   CREATE SCHEMA IF NOT EXISTS airline_system;
--   SET search_path TO airline_system, public;
-- -----------------------------------------------------------------------------


-- =========================================================
-- 1. AIRLINES (Dimension / Lookup Table)
-- =========================================================
CREATE TABLE IF NOT EXISTS AIRLINES (
    AirlineID VARCHAR(10) PRIMARY KEY,
    AirlineName VARCHAR(100) NOT NULL,
    IATA_Code VARCHAR(10) NOT NULL
);


-- =========================================================
-- 2. AIRPORT (Dimension / Lookup Table)
-- =========================================================
CREATE TABLE IF NOT EXISTS AIRPORT (
    AirportID VARCHAR(10) PRIMARY KEY,
    AirportName VARCHAR(100) NOT NULL,
    City VARCHAR(100) NOT NULL,
    Country VARCHAR(100) NOT NULL
);


-- =========================================================
-- 3. PASSENGER (Entity Table)
-- =========================================================
CREATE TABLE IF NOT EXISTS PASSENGER (
    PassengerID VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    DOB DATE NOT NULL,
    Street VARCHAR(150),
    City VARCHAR(100),
    PIN VARCHAR(10)
);


-- =========================================================
-- 4. EMPLOYEE (Entity Table)
-- =========================================================
CREATE TABLE IF NOT EXISTS EMPLOYEE (
    EmployeeID VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Designation VARCHAR(100) NOT NULL,
    Phone VARCHAR(20) NOT NULL
);


-- =========================================================
-- 5. BAGGAGE (Entity Table)
-- =========================================================
CREATE TABLE IF NOT EXISTS BAGGAGE (
    BaggageID VARCHAR(10) PRIMARY KEY,
    NoOfPieces INT NOT NULL,
    Weight DECIMAL(8,2) NOT NULL
);


-- =========================================================
-- 6. FLIGHT (Operational Schedule Entity)
-- =========================================================
CREATE TABLE IF NOT EXISTS FLIGHT (
    FlightID VARCHAR(10) PRIMARY KEY,
    AirlineID VARCHAR(10) NOT NULL,
    DepartureTime TIME NOT NULL,

    CONSTRAINT fk_flight_airline
        FOREIGN KEY (AirlineID)
        REFERENCES AIRLINES(AirlineID)
        ON DELETE RESTRICT
);


-- =========================================================
-- 7. RESERVATION (Transactional Booking Entity)
-- =========================================================
CREATE TABLE IF NOT EXISTS RESERVATION (
    ReservationID VARCHAR(10) PRIMARY KEY,
    PassengerID VARCHAR(10) NOT NULL,
    BookingStatus VARCHAR(30) NOT NULL,
    Class VARCHAR(30) NOT NULL,
    DepartureAirportID VARCHAR(10) NOT NULL,
    ArrivalAirportID VARCHAR(10) NOT NULL,

    CONSTRAINT fk_reservation_passenger
        FOREIGN KEY (PassengerID)
        REFERENCES PASSENGER(PassengerID)
        ON DELETE CASCADE,

    CONSTRAINT fk_reservation_departure
        FOREIGN KEY (DepartureAirportID)
        REFERENCES AIRPORT(AirportID)
        ON DELETE RESTRICT,

    CONSTRAINT fk_reservation_arrival
        FOREIGN KEY (ArrivalAirportID)
        REFERENCES AIRPORT(AirportID)
        ON DELETE RESTRICT
);


-- =========================================================
-- 8. TICKET (Associative Ticket Line Item)
-- =========================================================
CREATE TABLE IF NOT EXISTS TICKET (
    ReservationID VARCHAR(10) NOT NULL,
    TicketNo VARCHAR(10) NOT NULL,
    SeatNo VARCHAR(10),
    Fare DECIMAL(10,2) NOT NULL,

    PRIMARY KEY (ReservationID, TicketNo),

    CONSTRAINT fk_ticket_reservation
        FOREIGN KEY (ReservationID)
        REFERENCES RESERVATION(ReservationID)
        ON DELETE CASCADE
);


-- =========================================================
-- 9. PAYMENT (Financial Transaction Table)
-- =========================================================
CREATE TABLE IF NOT EXISTS PAYMENT (
    PaymentID VARCHAR(10) PRIMARY KEY,
    ReservationID VARCHAR(10) NOT NULL,
    TicketNo VARCHAR(10) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentMethod VARCHAR(50) NOT NULL,

    CONSTRAINT fk_payment_ticket
        FOREIGN KEY (ReservationID, TicketNo)
        REFERENCES TICKET(ReservationID, TicketNo)
        ON DELETE CASCADE
);


-- =========================================================
-- 10. BAGGAGE_TRACKING (TimescaleDB Hypertable)
-- =========================================================
CREATE TABLE IF NOT EXISTS BAGGAGE_TRACKING (
    BaggageID VARCHAR(10) NOT NULL,
    TrackingID VARCHAR(10) NOT NULL,
    ScanLocation VARCHAR(100) NOT NULL,
    ScanTime TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Composite primary key includes partitioning column (ScanTime) as required by TimescaleDB
    PRIMARY KEY (BaggageID, TrackingID, ScanTime),

    CONSTRAINT fk_tracking_baggage
        FOREIGN KEY (BaggageID)
        REFERENCES BAGGAGE(BaggageID)
        ON DELETE CASCADE
);

-- Convert BAGGAGE_TRACKING to a TimescaleDB Hypertable partitioned by ScanTime
SELECT create_hypertable(
    'BAGGAGE_TRACKING',
    'scantime',
    if_not_exists => TRUE
);

-- Baggage journey timeline query index
CREATE INDEX IF NOT EXISTS idx_baggage_tracking_timeline
    ON BAGGAGE_TRACKING (BaggageID, ScanTime DESC);


-- =========================================================
-- 11. TICKET_BAGGAGE (Many-to-Many Bridge Table)
-- =========================================================
CREATE TABLE IF NOT EXISTS TICKET_BAGGAGE (
    ReservationID VARCHAR(10) NOT NULL,
    TicketNo VARCHAR(10) NOT NULL,
    BaggageID VARCHAR(10) NOT NULL,
    CheckedInDate DATE NOT NULL,

    PRIMARY KEY (
        ReservationID,
        TicketNo,
        BaggageID
    ),

    CONSTRAINT fk_ticket_baggage_ticket
        FOREIGN KEY (ReservationID, TicketNo)
        REFERENCES TICKET(ReservationID, TicketNo)
        ON DELETE CASCADE,

    CONSTRAINT fk_ticket_baggage_baggage
        FOREIGN KEY (BaggageID)
        REFERENCES BAGGAGE(BaggageID)
        ON DELETE CASCADE
);


-- =========================================================
-- 12. PASSENGER_PHONE (Multivalued Attribute Bridge Table)
-- =========================================================
CREATE TABLE IF NOT EXISTS PASSENGER_PHONE (
    PassengerID VARCHAR(10) NOT NULL,
    Phone VARCHAR(20) NOT NULL,

    PRIMARY KEY (PassengerID, Phone),

    CONSTRAINT fk_passenger_phone
        FOREIGN KEY (PassengerID)
        REFERENCES PASSENGER(PassengerID)
        ON DELETE CASCADE
);


-- =========================================================
-- 13. FLIGHT_STATUS_HISTORY (Standard PostgreSQL Relational Table)
-- =========================================================
CREATE TABLE IF NOT EXISTS FLIGHT_STATUS_HISTORY (
    HistoryID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    FlightID VARCHAR(10) NOT NULL,
    PreviousStatus VARCHAR(30),
    NewStatus VARCHAR(30) NOT NULL,
    ChangeTimestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Remarks VARCHAR(255),

    CONSTRAINT fk_flight_status_flight
        FOREIGN KEY (FlightID)
        REFERENCES FLIGHT(FlightID)
        ON DELETE CASCADE
);

-- Fast timeline lookup index for flight status transitions
CREATE INDEX IF NOT EXISTS idx_flight_status_history_timeline
    ON FLIGHT_STATUS_HISTORY (FlightID, ChangeTimestamp DESC);


-- =========================================================
-- Supplementary Covering Indexes for Foreign Keys
-- (PostgreSQL does not automatically index foreign keys)
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_flight_airlineid ON FLIGHT (AirlineID);
CREATE INDEX IF NOT EXISTS idx_reservation_passengerid ON RESERVATION (PassengerID);
CREATE INDEX IF NOT EXISTS idx_reservation_departure ON RESERVATION (DepartureAirportID);
CREATE INDEX IF NOT EXISTS idx_reservation_arrival ON RESERVATION (ArrivalAirportID);
CREATE INDEX IF NOT EXISTS idx_payment_ticket ON PAYMENT (ReservationID, TicketNo);
CREATE INDEX IF NOT EXISTS idx_ticket_baggage_baggageid ON TICKET_BAGGAGE (BaggageID);
CREATE INDEX IF NOT EXISTS idx_passenger_phone_passengerid ON PASSENGER_PHONE (PassengerID);
