package com.airline.system.dao;

import com.airline.system.model.Airline;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AirlineDao {

    private final JdbcTemplate jdbcTemplate;

    public AirlineDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Airline> findAll() {

        String sql = """
                SELECT AirlineID, AirlineName, IATA_Code
                FROM AIRLINES
                ORDER BY AirlineID
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Airline(
                        rs.getString("AirlineID"),
                        rs.getString("AirlineName"),
                        rs.getString("IATA_Code")
                )
        );
    }

    public Airline findById(String id) {

        String sql = """
                SELECT AirlineID, AirlineName, IATA_Code
                FROM AIRLINES
                WHERE AirlineID = ?
                """;

        List<Airline> airlines = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Airline(
                        rs.getString("AirlineID"),
                        rs.getString("AirlineName"),
                        rs.getString("IATA_Code")
                ), id);

        return airlines.isEmpty() ? null : airlines.get(0);
    }

    public int save(Airline airline) {

        String sql = """
                INSERT INTO AIRLINES
                (AirlineID, AirlineName, IATA_Code)
                VALUES (?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                airline.getAirlineID(),
                airline.getAirlineName(),
                airline.getIataCode()
        );
    }

    public int update(String id, Airline airline) {

        String sql = """
                UPDATE AIRLINES
                SET AirlineName = ?,
                    IATA_Code = ?
                WHERE AirlineID = ?
                """;

        return jdbcTemplate.update(
                sql,
                airline.getAirlineName(),
                airline.getIataCode(),
                id
        );
    }

    public int delete(String id) {

        String sql = """
                DELETE FROM AIRLINES
                WHERE AirlineID = ?
                """;

        return jdbcTemplate.update(sql, id);
    }
}