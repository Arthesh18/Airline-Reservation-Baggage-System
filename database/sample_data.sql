-- =============================================================================
-- Airline Reservation & Baggage Tracking System
-- Target: TimescaleDB (PostgreSQL)
-- File: database/sample_data.sql
-- Description: Clean, consistent sample seed data for all 13 tables.
--              Inserted in strict foreign-key-safe order.
--              Includes realistic baggage tracking events across checkpoints
--              and flight status history state transitions.
-- =============================================================================

-- Clean up any existing records in reverse dependency order (child before parent)
DELETE FROM FLIGHT_STATUS_HISTORY;
DELETE FROM BAGGAGE_TRACKING;
DELETE FROM TICKET_BAGGAGE;
DELETE FROM PAYMENT;
DELETE FROM TICKET;
DELETE FROM RESERVATION;
DELETE FROM PASSENGER_PHONE;
DELETE FROM FLIGHT;
DELETE FROM BAGGAGE;
DELETE FROM PASSENGER;
DELETE FROM EMPLOYEE;
DELETE FROM AIRPORT;
DELETE FROM AIRLINES;

-- =========================================================
-- 1. AIRLINES (Parent)
-- =========================================================
INSERT INTO AIRLINES (AirlineID, AirlineName, IATA_Code) VALUES
('AL01', 'Emirates', 'EK'),
('AL02', 'Singapore Airlines', 'SQ'),
('AL03', 'British Airways', 'BA'),
('AL04', 'Delta Air Lines', 'DL');

-- =========================================================
-- 2. AIRPORT (Parent)
-- =========================================================
INSERT INTO AIRPORT (AirportID, AirportName, City, Country) VALUES
('DXB', 'Dubai International Airport', 'Dubai', 'United Arab Emirates'),
('SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore'),
('LHR', 'London Heathrow Airport', 'London', 'United Kingdom'),
('JFK', 'John F. Kennedy International Airport', 'New York', 'United States');

-- =========================================================
-- 3. EMPLOYEE (Independent Entity)
-- =========================================================
INSERT INTO EMPLOYEE (EmployeeID, Name, Designation, Phone) VALUES
('EMP01', 'Marcus Vance', 'Ground Operations Manager', '+1-555-0199'),
('EMP02', 'Sarah Jenkins', 'Baggage Handling Lead', '+44-20-7946-0123'),
('EMP03', 'Rohan Mehta', 'Gate Agent', '+971-4-216-2525'),
('EMP04', 'Aiko Tanaka', 'Flight Dispatcher', '+65-6541-2345');

-- =========================================================
-- 4. PASSENGER (Parent)
-- =========================================================
INSERT INTO PASSENGER (PassengerID, Name, Email, DOB, Street, City, PIN) VALUES
('P101', 'Alexander Wright', 'alex.wright@example.com', '1988-04-12', '452 Elm Street', 'New York', '10001'),
('P102', 'Elena Rostova', 'elena.rostova@example.com', '1993-09-24', '12 Kensington Road', 'London', 'W8 5TT'),
('P103', 'Chen Wei', 'chen.wei@example.com', '1985-11-03', '88 Orchard Road', 'Singapore', '238839'),
('P104', 'Fatima Al-Mansoor', 'fatima.m@example.com', '1997-01-18', '21 Jumeirah Beach Road', 'Dubai', '12345');

-- =========================================================
-- 5. PASSENGER_PHONE (Child of PASSENGER)
-- =========================================================
INSERT INTO PASSENGER_PHONE (PassengerID, Phone) VALUES
('P101', '+1-212-555-0144'),
('P101', '+1-212-555-0199'),
('P102', '+44-20-7946-0912'),
('P103', '+65-9123-4567'),
('P104', '+971-50-123-4567');

-- =========================================================
-- 6. BAGGAGE (Parent)
-- =========================================================
INSERT INTO BAGGAGE (BaggageID, NoOfPieces, Weight) VALUES
('BG201', 1, 22.50),
('BG202', 2, 38.00),
('BG203', 1, 18.20),
('BG204', 1, 24.10);

-- =========================================================
-- 7. FLIGHT (Child of AIRLINES)
-- =========================================================
INSERT INTO FLIGHT (FlightID, AirlineID, DepartureTime) VALUES
('FL301', 'AL01', '08:30:00'),
('FL302', 'AL02', '14:15:00'),
('FL303', 'AL03', '19:45:00'),
('FL304', 'AL04', '22:00:00');

-- =========================================================
-- 8. RESERVATION (Child of PASSENGER and AIRPORT)
-- =========================================================
INSERT INTO RESERVATION (ReservationID, PassengerID, BookingStatus, Class, DepartureAirportID, ArrivalAirportID) VALUES
('RES401', 'P101', 'Confirmed', 'Business', 'JFK', 'LHR'),
('RES402', 'P102', 'Confirmed', 'Economy', 'LHR', 'DXB'),
('RES403', 'P103', 'Confirmed', 'First', 'SIN', 'DXB'),
('RES404', 'P104', 'Confirmed', 'Economy', 'DXB', 'LHR');

-- =========================================================
-- 9. TICKET (Child of RESERVATION)
-- =========================================================
INSERT INTO TICKET (ReservationID, TicketNo, SeatNo, Fare) VALUES
('RES401', 'TK501', '04A', 2450.00),
('RES402', 'TK502', '28C', 680.00),
('RES403', 'TK503', '01K', 4200.00),
('RES404', 'TK504', '32F', 710.00);

-- =========================================================
-- 10. PAYMENT (Child of TICKET)
-- =========================================================
INSERT INTO PAYMENT (PaymentID, ReservationID, TicketNo, Amount, PaymentMethod) VALUES
('PAY601', 'RES401', 'TK501', 2450.00, 'Credit Card'),
('PAY602', 'RES402', 'TK502', 680.00, 'Debit Card'),
('PAY603', 'RES403', 'TK503', 4200.00, 'Credit Card'),
('PAY604', 'RES404', 'TK504', 710.00, 'PayPal');

-- =========================================================
-- 11. TICKET_BAGGAGE (Child of TICKET and BAGGAGE)
-- =========================================================
INSERT INTO TICKET_BAGGAGE (ReservationID, TicketNo, BaggageID, CheckedInDate) VALUES
('RES401', 'TK501', 'BG201', CURRENT_DATE),
('RES402', 'TK502', 'BG202', CURRENT_DATE),
('RES403', 'TK503', 'BG203', CURRENT_DATE),
('RES404', 'TK504', 'BG204', CURRENT_DATE);

-- =========================================================
-- 12. BAGGAGE_TRACKING (Child of BAGGAGE - Hypertable Data)
-- =========================================================
INSERT INTO BAGGAGE_TRACKING (BaggageID, TrackingID, ScanLocation, ScanTime) VALUES
-- BG201 Journey (JFK -> LHR)
('BG201', 'TRK01', 'JFK Terminal 4 Check-in Desk 12', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
('BG201', 'TRK02', 'JFK TSA Automated Screening Area B', CURRENT_TIMESTAMP - INTERVAL '5 hours 30 minutes'),
('BG201', 'TRK03', 'JFK Conveyor Sortation Bay 7', CURRENT_TIMESTAMP - INTERVAL '5 hours'),
('BG201', 'TRK04', 'JFK Gate B22 Tarmac Cart Loading', CURRENT_TIMESTAMP - INTERVAL '4 hours 15 minutes'),
('BG201', 'TRK05', 'Flight FL301 Aircraft Cargo Hold Aft', CURRENT_TIMESTAMP - INTERVAL '4 hours'),

-- BG202 Journey (LHR -> DXB)
('BG202', 'TRK06', 'LHR Terminal 5 Check-in Zone C', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
('BG202', 'TRK07', 'LHR Security Screening Belt 4', CURRENT_TIMESTAMP - INTERVAL '2 hours 30 minutes'),
('BG202', 'TRK08', 'LHR Baggage Tug Transfer 14', CURRENT_TIMESTAMP - INTERVAL '1 hour 45 minutes'),

-- BG203 Journey (SIN -> DXB)
('BG203', 'TRK09', 'SIN Terminal 3 First Class Desk', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('BG203', 'TRK10', 'SIN High-Speed Baggage Tunnel T3', CURRENT_TIMESTAMP - INTERVAL '1 hour 15 minutes'),

-- BG204 Journey (DXB -> LHR)
('BG204', 'TRK11', 'DXB Terminal 3 Emirates Check-in Counter 18', CURRENT_TIMESTAMP - INTERVAL '3 hours 30 minutes'),
('BG204', 'TRK12', 'DXB Automated Baggage Screening Matrix 5', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
('BG204', 'TRK13', 'DXB Underground Baggage Carousel Belt 2', CURRENT_TIMESTAMP - INTERVAL '2 hours 15 minutes'),
('BG204', 'TRK14', 'DXB Gate A12 Container Dollies Loading', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes');

-- =========================================================
-- 13. FLIGHT_STATUS_HISTORY (Child of FLIGHT)
-- =========================================================
INSERT INTO FLIGHT_STATUS_HISTORY (FlightID, PreviousStatus, NewStatus, ChangeTimestamp, Remarks) VALUES
('FL301', NULL, 'SCHEDULED', CURRENT_TIMESTAMP - INTERVAL '12 hours', 'Flight entered active schedule'),
('FL301', 'SCHEDULED', 'BOARDING', CURRENT_TIMESTAMP - INTERVAL '4 hours 30 minutes', 'Gate B22 open for boarding'),
('FL301', 'BOARDING', 'DEPARTED', CURRENT_TIMESTAMP - INTERVAL '4 hours', 'Pushback completed on time'),

('FL302', NULL, 'SCHEDULED', CURRENT_TIMESTAMP - INTERVAL '8 hours', 'Flight entered active schedule'),
('FL302', 'SCHEDULED', 'DELAYED', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'Delayed 30 mins due to incoming aircraft late arrival'),
('FL302', 'DELAYED', 'BOARDING', CURRENT_TIMESTAMP - INTERVAL '30 minutes', 'Boarding resumed at Gate C10'),

('FL303', NULL, 'SCHEDULED', CURRENT_TIMESTAMP - INTERVAL '5 hours', 'Scheduled departure at 19:45'),
('FL304', NULL, 'SCHEDULED', CURRENT_TIMESTAMP - INTERVAL '4 hours', 'Scheduled departure at 22:00');
