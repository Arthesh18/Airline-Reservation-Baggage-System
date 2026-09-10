package com.airline.system.dao;

import com.airline.system.model.Passenger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PassengerDao {

    private final JdbcTemplate jdbcTemplate;

    public PassengerDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Passenger> findAll() {

        String sql = """
                SELECT PassengerID, Name, Email, DOB, Street, City, PIN
                FROM PASSENGER
                ORDER BY PassengerID
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Passenger(
                        rs.getString("PassengerID"),
                        rs.getString("Name"),
                        rs.getString("Email"),
                        rs.getDate("DOB").toLocalDate(),
                        rs.getString("Street"),
                        rs.getString("City"),
                        rs.getString("PIN")
                )
        );
    }

    public Passenger findById(String id) {

        String sql = """
                SELECT PassengerID, Name, Email, DOB, Street, City, PIN
                FROM PASSENGER
                WHERE PassengerID = ?
                """;

        List<Passenger> passengers = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Passenger(
                        rs.getString("PassengerID"),
                        rs.getString("Name"),
                        rs.getString("Email"),
                        rs.getDate("DOB").toLocalDate(),
                        rs.getString("Street"),
                        rs.getString("City"),
                        rs.getString("PIN")
                ), id);

        return passengers.isEmpty() ? null : passengers.get(0);
    }

    public int save(Passenger passenger) {

        String sql = """
                INSERT INTO PASSENGER
                (PassengerID, Name, Email, DOB, Street, City, PIN)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                passenger.getPassengerID(),
                passenger.getName(),
                passenger.getEmail(),
                passenger.getDob(),
                passenger.getStreet(),
                passenger.getCity(),
                passenger.getPin()
        );
    }

    public int update(String id, Passenger passenger) {

        String sql = """
                UPDATE PASSENGER
                SET Name = ?,
                    Email = ?,
                    DOB = ?,
                    Street = ?,
                    City = ?,
                    PIN = ?
                WHERE PassengerID = ?
                """;

        return jdbcTemplate.update(
                sql,
                passenger.getName(),
                passenger.getEmail(),
                passenger.getDob(),
                passenger.getStreet(),
                passenger.getCity(),
                passenger.getPin(),
                id
        );
    }

    public int delete(String id) {

        String sql = """
                DELETE FROM PASSENGER
                WHERE PassengerID = ?
                """;

        return jdbcTemplate.update(sql, id);
    }
}