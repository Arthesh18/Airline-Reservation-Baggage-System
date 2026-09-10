package com.airline.system.dao;

import com.airline.system.model.Airport;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AirportDao {

    private final JdbcTemplate jdbcTemplate;

    public AirportDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Airport> findAll() {

        String sql = """
                SELECT AirportID, AirportName, City, Country
                FROM AIRPORT
                ORDER BY AirportID
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Airport(
                        rs.getString("AirportID"),
                        rs.getString("AirportName"),
                        rs.getString("City"),
                        rs.getString("Country")
                )
        );
    }

    public Airport findById(String id) {

        String sql = """
                SELECT AirportID, AirportName, City, Country
                FROM AIRPORT
                WHERE AirportID = ?
                """;

        List<Airport> airports = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Airport(
                        rs.getString("AirportID"),
                        rs.getString("AirportName"),
                        rs.getString("City"),
                        rs.getString("Country")
                ), id);

        return airports.isEmpty() ? null : airports.get(0);
    }

    public int save(Airport airport) {

        String sql = """
                INSERT INTO AIRPORT
                (AirportID, AirportName, City, Country)
                VALUES (?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                airport.getAirportID(),
                airport.getAirportName(),
                airport.getCity(),
                airport.getCountry()
        );
    }

    public int update(String id, Airport airport) {

        String sql = """
                UPDATE AIRPORT
                SET AirportName = ?,
                    City = ?,
                    Country = ?
                WHERE AirportID = ?
                """;

        return jdbcTemplate.update(
                sql,
                airport.getAirportName(),
                airport.getCity(),
                airport.getCountry(),
                id
        );
    }

    public int delete(String id) {

        String sql = """
                DELETE FROM AIRPORT
                WHERE AirportID = ?
                """;

        return jdbcTemplate.update(sql, id);
    }
}