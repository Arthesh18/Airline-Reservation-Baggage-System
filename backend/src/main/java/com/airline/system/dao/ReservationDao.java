package com.airline.system.dao;

import com.airline.system.model.Reservation;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ReservationDao {

    private final JdbcTemplate jdbcTemplate;

    public ReservationDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Reservation> findAll() {

        String sql = """
                SELECT ReservationID, PassengerID, BookingStatus,
                       Class, DepartureAirportID, ArrivalAirportID
                FROM RESERVATION
                ORDER BY ReservationID
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Reservation(
                        rs.getString("ReservationID"),
                        rs.getString("PassengerID"),
                        rs.getString("BookingStatus"),
                        rs.getString("Class"),
                        rs.getString("DepartureAirportID"),
                        rs.getString("ArrivalAirportID")
                )
        );
    }

    public Reservation findById(String id) {

        String sql = """
                SELECT ReservationID, PassengerID, BookingStatus,
                       Class, DepartureAirportID, ArrivalAirportID
                FROM RESERVATION
                WHERE ReservationID = ?
                """;

        List<Reservation> reservations = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Reservation(
                        rs.getString("ReservationID"),
                        rs.getString("PassengerID"),
                        rs.getString("BookingStatus"),
                        rs.getString("Class"),
                        rs.getString("DepartureAirportID"),
                        rs.getString("ArrivalAirportID")
                ), id);

        return reservations.isEmpty() ? null : reservations.get(0);
    }

    public int save(Reservation reservation) {

        String sql = """
                INSERT INTO RESERVATION
                (ReservationID, PassengerID, BookingStatus, Class,
                 DepartureAirportID, ArrivalAirportID)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                reservation.getReservationID(),
                reservation.getPassengerID(),
                reservation.getBookingStatus(),
                reservation.getReservationClass(),
                reservation.getDepartureAirportID(),
                reservation.getArrivalAirportID()
        );
    }

    public int update(String id, Reservation reservation) {

        String sql = """
                UPDATE RESERVATION
                SET PassengerID = ?,
                    BookingStatus = ?,
                    Class = ?,
                    DepartureAirportID = ?,
                    ArrivalAirportID = ?
                WHERE ReservationID = ?
                """;

        return jdbcTemplate.update(
                sql,
                reservation.getPassengerID(),
                reservation.getBookingStatus(),
                reservation.getReservationClass(),
                reservation.getDepartureAirportID(),
                reservation.getArrivalAirportID(),
                id
        );
    }

    public int delete(String id) {

        String sql = """
                DELETE FROM RESERVATION
                WHERE ReservationID = ?
                """;

        return jdbcTemplate.update(sql, id);
    }
}