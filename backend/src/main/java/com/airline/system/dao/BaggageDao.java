package com.airline.system.dao;

import com.airline.system.model.Baggage;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BaggageDao {

    private final JdbcTemplate jdbcTemplate;

    public BaggageDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Baggage> findAll() {

        String sql = """
                SELECT BaggageID, NoOfPieces, Weight
                FROM BAGGAGE
                ORDER BY BaggageID
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Baggage(
                        rs.getString("BaggageID"),
                        rs.getInt("NoOfPieces"),
                        rs.getBigDecimal("Weight")
                )
        );
    }

    public Baggage findById(String id) {

        String sql = """
                SELECT BaggageID, NoOfPieces, Weight
                FROM BAGGAGE
                WHERE BaggageID = ?
                """;

        List<Baggage> baggage = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Baggage(
                        rs.getString("BaggageID"),
                        rs.getInt("NoOfPieces"),
                        rs.getBigDecimal("Weight")
                ), id);

        return baggage.isEmpty() ? null : baggage.get(0);
    }

    public int save(Baggage baggage) {

        String sql = """
                INSERT INTO BAGGAGE
                (BaggageID, NoOfPieces, Weight)
                VALUES (?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                baggage.getBaggageID(),
                baggage.getNoOfPieces(),
                baggage.getWeight()
        );
    }

    public int update(String id, Baggage baggage) {

        String sql = """
                UPDATE BAGGAGE
                SET NoOfPieces = ?,
                    Weight = ?
                WHERE BaggageID = ?
                """;

        return jdbcTemplate.update(
                sql,
                baggage.getNoOfPieces(),
                baggage.getWeight(),
                id
        );
    }

    public int delete(String id) {

        String sql = """
                DELETE FROM BAGGAGE
                WHERE BaggageID = ?
                """;

        return jdbcTemplate.update(sql, id);
    }
}