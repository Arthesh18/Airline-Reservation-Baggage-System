package com.airline.system.dao;

import com.airline.system.model.BaggageTracking;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Repository
public class BaggageTrackingDao {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<BaggageTracking> rowMapper = (rs, rowNum) -> {
        Timestamp ts = rs.getTimestamp("ScanTime");
        OffsetDateTime scanTime = ts != null
                ? ts.toInstant().atOffset(ZoneOffset.UTC)
                : null;

        return new BaggageTracking(
                rs.getString("BaggageID"),
                rs.getString("TrackingID"),
                rs.getString("ScanLocation"),
                scanTime
        );
    };

    public BaggageTrackingDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<BaggageTracking> findAll() {
        String sql = """
                SELECT BaggageID, TrackingID, ScanLocation, ScanTime
                FROM BAGGAGE_TRACKING
                ORDER BY BaggageID, ScanTime DESC
                """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Exact lookup by hypertable composite primary key (BaggageID, TrackingID, ScanTime).
     */
    public BaggageTracking findById(String baggageID, String trackingID, OffsetDateTime scanTime) {
        String sql = """
                SELECT BaggageID, TrackingID, ScanLocation, ScanTime
                FROM BAGGAGE_TRACKING
                WHERE BaggageID = ?
                  AND TrackingID = ?
                  AND ScanTime = ?
                """;

        List<BaggageTracking> records = jdbcTemplate.query(
                sql,
                rowMapper,
                baggageID,
                trackingID,
                scanTime != null ? Timestamp.from(scanTime.toInstant()) : null
        );

        return records.isEmpty() ? null : records.get(0);
    }

    /**
     * Finds the latest tracking scan for a given BaggageID and TrackingID.
     */
    public BaggageTracking findById(String baggageID, String trackingID) {
        String sql = """
                SELECT BaggageID, TrackingID, ScanLocation, ScanTime
                FROM BAGGAGE_TRACKING
                WHERE BaggageID = ?
                  AND TrackingID = ?
                ORDER BY ScanTime DESC
                LIMIT 1
                """;

        List<BaggageTracking> records = jdbcTemplate.query(
                sql,
                rowMapper,
                baggageID,
                trackingID
        );

        return records.isEmpty() ? null : records.get(0);
    }

    /**
     * Retrieves the chronological timeline of all scans for a specific baggage item.
     */
    public List<BaggageTracking> findTimelineByBaggageId(String baggageID) {
        String sql = """
                SELECT BaggageID, TrackingID, ScanLocation, ScanTime
                FROM BAGGAGE_TRACKING
                WHERE BaggageID = ?
                ORDER BY ScanTime ASC
                """;

        return jdbcTemplate.query(sql, rowMapper, baggageID);
    }

    public int save(BaggageTracking tracking) {
        String sql = """
                INSERT INTO BAGGAGE_TRACKING
                (BaggageID, TrackingID, ScanLocation, ScanTime)
                VALUES (?, ?, ?, ?)
                """;

        OffsetDateTime scanTime = tracking.getScanTime() != null
                ? tracking.getScanTime()
                : OffsetDateTime.now();

        return jdbcTemplate.update(
                sql,
                tracking.getBaggageID(),
                tracking.getTrackingID(),
                tracking.getScanLocation(),
                Timestamp.from(scanTime.toInstant())
        );
    }

    public int update(String baggageID, String trackingID, OffsetDateTime scanTime, BaggageTracking tracking) {
        String sql = """
                UPDATE BAGGAGE_TRACKING
                SET ScanLocation = ?,
                    ScanTime = ?
                WHERE BaggageID = ?
                  AND TrackingID = ?
                  AND ScanTime = ?
                """;

        OffsetDateTime newScanTime = tracking.getScanTime() != null
                ? tracking.getScanTime()
                : scanTime;

        return jdbcTemplate.update(
                sql,
                tracking.getScanLocation(),
                Timestamp.from(newScanTime.toInstant()),
                baggageID,
                trackingID,
                Timestamp.from(scanTime.toInstant())
        );
    }

    public int update(String baggageID, String trackingID, BaggageTracking tracking) {
        BaggageTracking existing = findById(baggageID, trackingID);
        if (existing == null) {
            return 0;
        }
        return update(baggageID, trackingID, existing.getScanTime(), tracking);
    }

    public int delete(String baggageID, String trackingID, OffsetDateTime scanTime) {
        String sql = """
                DELETE FROM BAGGAGE_TRACKING
                WHERE BaggageID = ?
                  AND TrackingID = ?
                  AND ScanTime = ?
                """;

        return jdbcTemplate.update(
                sql,
                baggageID,
                trackingID,
                Timestamp.from(scanTime.toInstant())
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
