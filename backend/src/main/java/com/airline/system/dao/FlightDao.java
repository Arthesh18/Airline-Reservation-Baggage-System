package com.airline.system.dao;

import com.airline.system.model.Flight;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FlightDao {

    private final JdbcTemplate jdbcTemplate;

    public FlightDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Flight> findAll() {

        String sql = """
                SELECT FlightID, AirlineID, DepartureTime
                FROM FLIGHT
                ORDER BY FlightID
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Flight(
                        rs.getString("FlightID"),
                        rs.getString("AirlineID"),
                        rs.getTime("DepartureTime").toLocalTime()
                )
        );
    }

    public Flight findById(String id) {

        String sql = """
                SELECT FlightID, AirlineID, DepartureTime
                FROM FLIGHT
                WHERE FlightID = ?
                """;

        List<Flight> flights = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Flight(
                        rs.getString("FlightID"),
                        rs.getString("AirlineID"),
                        rs.getTime("DepartureTime").toLocalTime()
                ), id);

        return flights.isEmpty() ? null : flights.get(0);
    }

    public int save(Flight flight) {

        String sql = """
                INSERT INTO FLIGHT
                (FlightID, AirlineID, DepartureTime)
                VALUES (?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                flight.getFlightID(),
                flight.getAirlineID(),
                flight.getDepartureTime()
        );
    }

    public int update(String id, Flight flight) {

        String sql = """
                UPDATE FLIGHT
                SET AirlineID = ?,
                    DepartureTime = ?
                WHERE FlightID = ?
                """;

        return jdbcTemplate.update(
                sql,
                flight.getAirlineID(),
                flight.getDepartureTime(),
                id
        );
    }

    public int delete(String id) {

        String sql = """
                DELETE FROM FLIGHT
                WHERE FlightID = ?
                """;

        return jdbcTemplate.update(sql, id);
    }
}