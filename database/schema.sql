CREATE DATABASE IF NOT EXISTS airline_system;

USE airline_system;


-- =========================================================
-- 1. AIRLINES
-- =========================================================

CREATE TABLE IF NOT EXISTS AIRLINES (
    AirlineID VARCHAR(10) PRIMARY KEY,
    AirlineName VARCHAR(100) NOT NULL,
    IATA_Code VARCHAR(10) NOT NULL
);


-- =========================================================
-- 2. AIRPORT
-- =========================================================

CREATE TABLE IF NOT EXISTS AIRPORT (
    AirportID VARCHAR(10) PRIMARY KEY,
    AirportName VARCHAR(100) NOT NULL,
    City VARCHAR(100) NOT NULL,
    Country VARCHAR(100) NOT NULL
);


-- =========================================================
-- 3. PASSENGER
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
-- 4. EMPLOYEE
-- =========================================================

CREATE TABLE IF NOT EXISTS EMPLOYEE (
    EmployeeID VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Designation VARCHAR(100) NOT NULL,
    Phone VARCHAR(20) NOT NULL
);


-- =========================================================
-- 5. BAGGAGE
-- =========================================================

CREATE TABLE IF NOT EXISTS BAGGAGE (
    BaggageID VARCHAR(10) PRIMARY KEY,
    NoOfPieces INT NOT NULL,
    Weight DECIMAL(8,2) NOT NULL
);


-- =========================================================
-- 6. FLIGHT
-- =========================================================

CREATE TABLE IF NOT EXISTS FLIGHT (
    FlightID VARCHAR(10) PRIMARY KEY,
    AirlineID VARCHAR(10) NOT NULL,
    DepartureTime TIME NOT NULL,

    CONSTRAINT fk_flight_airline
        FOREIGN KEY (AirlineID)
        REFERENCES AIRLINES(AirlineID)
);


-- =========================================================
-- 7. RESERVATION
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
        REFERENCES PASSENGER(PassengerID),

    CONSTRAINT fk_reservation_departure
        FOREIGN KEY (DepartureAirportID)
        REFERENCES AIRPORT(AirportID),

    CONSTRAINT fk_reservation_arrival
        FOREIGN KEY (ArrivalAirportID)
        REFERENCES AIRPORT(AirportID)
);


-- =========================================================
-- 8. TICKET
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
);


-- =========================================================
-- 9. PAYMENT
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
);


-- =========================================================
-- 10. BAGGAGE_TRACKING
-- =========================================================

CREATE TABLE IF NOT EXISTS BAGGAGE_TRACKING (
    BaggageID VARCHAR(10) NOT NULL,
    TrackingID VARCHAR(10) NOT NULL,
    ScanLocation VARCHAR(100) NOT NULL,
    ScanTime TIME NOT NULL,

    PRIMARY KEY (BaggageID, TrackingID),

    CONSTRAINT fk_tracking_baggage
        FOREIGN KEY (BaggageID)
        REFERENCES BAGGAGE(BaggageID)
);


-- =========================================================
-- 11. TICKET_BAGGAGE
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
        REFERENCES TICKET(ReservationID, TicketNo),

    CONSTRAINT fk_ticket_baggage_baggage
        FOREIGN KEY (BaggageID)
        REFERENCES BAGGAGE(BaggageID)
);


-- =========================================================
-- 12. PASSENGER_PHONE
-- =========================================================

CREATE TABLE IF NOT EXISTS PASSENGER_PHONE (
    PassengerID VARCHAR(10) NOT NULL,
    Phone VARCHAR(20) NOT NULL,

    PRIMARY KEY (PassengerID, Phone),

    CONSTRAINT fk_passenger_phone
        FOREIGN KEY (PassengerID)
        REFERENCES PASSENGER(PassengerID)
);