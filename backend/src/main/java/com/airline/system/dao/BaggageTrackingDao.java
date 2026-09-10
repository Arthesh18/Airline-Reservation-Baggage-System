package com.airline.system.dao;

import com.airline.system.model.BaggageTracking;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BaggageTrackingDao {

    private final JdbcTemplate jdbcTemplate;

    public BaggageTrackingDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<BaggageTracking> findAll() {

        String sql = """
                SELECT BaggageID, TrackingID, ScanLocation, ScanTime
                FROM BAGGAGE_TRACKING
                ORDER BY BaggageID, TrackingID
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new BaggageTracking(
                        rs.getString("BaggageID"),
                        rs.getString("TrackingID"),
                        rs.getString("ScanLocation"),
                        rs.getTime("ScanTime").toLocalTime()
                )
        );
    }

    public BaggageTracking findById(String baggageID, String trackingID) {

        String sql = """
                SELECT BaggageID, TrackingID, ScanLocation, ScanTime
                FROM BAGGAGE_TRACKING
                WHERE BaggageID = ?
                  AND TrackingID = ?
                """;

        List<BaggageTracking> tracking = jdbcTemplate.query(
                sql,
                (rs, rowNum) ->
                        new BaggageTracking(
                                rs.getString("BaggageID"),
                                rs.getString("TrackingID"),
                                rs.getString("ScanLocation"),
                                rs.getTime("ScanTime").toLocalTime()
                        ),
                baggageID,
                trackingID
        );

        return tracking.isEmpty() ? null : tracking.get(0);
    }

    public int save(BaggageTracking tracking) {

        String sql = """
                INSERT INTO BAGGAGE_TRACKING
                (BaggageID, TrackingID, ScanLocation, ScanTime)
                VALUES (?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                tracking.getBaggageID(),
                tracking.getTrackingID(),
                tracking.getScanLocation(),
                tracking.getScanTime()
        );
    }

    public int update(String baggageID, String trackingID,
                      BaggageTracking tracking) {

        String sql = """
                UPDATE BAGGAGE_TRACKING
                SET ScanLocation = ?,
                    ScanTime = ?
                WHERE BaggageID = ?
                  AND TrackingID = ?
                """;

        return jdbcTemplate.update(
                sql,
                tracking.getScanLocation(),
                tracking.getScanTime(),
                baggageID,
                trackingID
        );
    }

    public int delete(String baggageID, String trackingID) {

        String sql = """
                DELETE FROM BAGGAGE_TRACKING
                WHERE BaggageID = ?
                  AND TrackingID = ?
                """;

        return jdbcTemplate.update(
                sql,
                baggageID,
                trackingID
        );
    }
}