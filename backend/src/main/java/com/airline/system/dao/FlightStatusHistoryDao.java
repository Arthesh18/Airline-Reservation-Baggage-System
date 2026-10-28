package com.airline.system.dao;

import com.airline.system.model.FlightStatusHistory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Repository
public class FlightStatusHistoryDao {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<FlightStatusHistory> rowMapper = (rs, rowNum) -> {
        Timestamp ts = rs.getTimestamp("ChangeTimestamp");
        OffsetDateTime timestamp = ts != null
                ? ts.toInstant().atOffset(ZoneOffset.UTC)
                : null;

        return new FlightStatusHistory(
                rs.getLong("HistoryID"),
                rs.getString("FlightID"),
                rs.getString("PreviousStatus"),
                rs.getString("NewStatus"),
                timestamp,
                rs.getString("Remarks")
        );
    };

    public FlightStatusHistoryDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<FlightStatusHistory> findAll() {
        String sql = """
                SELECT HistoryID, FlightID, PreviousStatus, NewStatus, ChangeTimestamp, Remarks
                FROM FLIGHT_STATUS_HISTORY
                ORDER BY ChangeTimestamp DESC
                """;
        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<FlightStatusHistory> findByFlightId(String flightID) {
        String sql = """
                SELECT HistoryID, FlightID, PreviousStatus, NewStatus, ChangeTimestamp, Remarks
                FROM FLIGHT_STATUS_HISTORY
                WHERE FlightID = ?
                ORDER BY ChangeTimestamp ASC
                """;
        return jdbcTemplate.query(sql, rowMapper, flightID);
    }

    public FlightStatusHistory findById(Long historyID) {
        String sql = """
                SELECT HistoryID, FlightID, PreviousStatus, NewStatus, ChangeTimestamp, Remarks
                FROM FLIGHT_STATUS_HISTORY
                WHERE HistoryID = ?
                """;
        List<FlightStatusHistory> results = jdbcTemplate.query(sql, rowMapper, historyID);
        return results.isEmpty() ? null : results.get(0);
    }

    public int save(FlightStatusHistory history) {
        String sql = """
                INSERT INTO FLIGHT_STATUS_HISTORY
                (FlightID, PreviousStatus, NewStatus, ChangeTimestamp, Remarks)
                VALUES (?, ?, ?, ?, ?)
                """;

        OffsetDateTime timestamp = history.getChangeTimestamp() != null
                ? history.getChangeTimestamp()
                : OffsetDateTime.now();

        return jdbcTemplate.update(
                sql,
                history.getFlightID(),
                history.getPreviousStatus(),
                history.getNewStatus(),
                Timestamp.from(timestamp.toInstant()),
                history.getRemarks()
        );
    }

    public int delete(Long historyID) {
        String sql = "DELETE FROM FLIGHT_STATUS_HISTORY WHERE HistoryID = ?";
        return jdbcTemplate.update(sql, historyID);
    }

    public int deleteByFlightId(String flightID) {
        String sql = "DELETE FROM FLIGHT_STATUS_HISTORY WHERE FlightID = ?";
        return jdbcTemplate.update(sql, flightID);
    }
}
